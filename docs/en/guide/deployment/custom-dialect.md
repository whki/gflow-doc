# Custom Database Dialects

<div class="lead">
GFlow ships with PostgreSQL and MySQL built in; DM (Dameng), KingbaseES, GaussDB, and other databases plug in through the <code>DialectProvider</code> extension point: implement three methods, register once, change one line of config — no connection-logic changes required. Extension drivers must be pure Go, with no CGO/GCC dependency.
</div>

## Support Matrix

| Database | Status | Driver aliases |
|---|---|---|
| PostgreSQL | Built-in | `postgres`, `postgresql` |
| MySQL | Built-in | `mysql` |
| DM, KingbaseES, GaussDB, OceanBase, etc. | Via dialect extension | Determined by the custom Provider |

Both products share the same extension mechanism:

- **GFlow Engine (open-source engine library)**: the `service.DialectProvider` interface + a global dialect registry; a runnable example is at `gflow-engine/examples/custom_dialect` in the repository;
- **GFlow Platform (the gflow main application)**: all database connections go through the engine's dialect registry; the extension entry point is exposed as `internal/database.RegisterDialectProvider`.

## How It Works

The engine package maintains a global `DialectRegistry`: importing the engine `service` package automatically registers the built-in postgres / mysql dialects; when the main application's `InitDatabase` reads the `driver` from the config, it resolves a GORM `Dialector` from the registry and then opens the connection. Unknown drivers fail loudly — there is no silent fallback.

```
config.yaml (driver=dm) → Provider registered via RegisterDialectProvider → gorm.Dialector → gorm.Open
```

## Integration Steps (DM as an Example, gflow Main Application)

gflow is a single-binary application, so the registration code must be part of your own build (fork the repository, add one file as described below, and recompile).

### 1. Add a pure-Go GORM driver

Use the GORM driver provided officially or by the community for DM (verify it has no CGO dependency):

```bash
cd gflow && go get your-dm-driver-module
```

### 2. Implement DialectProvider and register it

Add a new file under `gflow/internal/database/` (e.g. `dialect_dameng.go`):

```go
package database

import (
	dm "your-dm-driver-module" // pure-Go GORM driver for DM
	"gorm.io/gorm"
)

type damengDialectProvider struct{}

func (d *damengDialectProvider) GetName() string { return "dameng" }

func (d *damengDialectProvider) CreateDialector(dsn string) (gorm.Dialector, error) {
	return dm.Open(dsn), nil
}

func (d *damengDialectProvider) GetSupportedDrivers() []string {
	return []string{"dm", "dameng"}
}

// Registration must happen before InitDatabase
func init() { _ = RegisterDialectProvider(&damengDialectProvider{}) }
```

### 3. Change the configuration

```yaml
database:
  driver: dm   # or dameng — any alias listed in GetSupportedDrivers
  dsn: dm://username:password@localhost:5236/SYSDBA
```

### 4. Rebuild

```bash
cd gflow && CGO_ENABLED=0 make build
```

## Using GFlow Engine Only (as a Library)

The engine library is even more direct — pick either registration method:

```go
// Option 1: builder injection (effective only for this engine instance)
engine, err := service.NewWorkflowEngineBuilder().
    SetConfig(cfg).
    SetDialectProvider(&DamengDialectProvider{}).
    Build()

// Option 2: global registry (process-wide; recommended inside init())
err := service.RegisterDialectProvider(&DamengDialectProvider{})
```

A complete runnable example is at `gflow-engine/examples/custom_dialect` in the repository (includes Provider skeletons for DM and KingbaseES).

## Constraints and Caveats

1. **The driver must be pure Go (no CGO)**. gflow must stay buildable with `CGO_ENABLED=0`, require no GCC, and remain cross-compilable; any CGO driver breaks that. Counter-example: `gorm.io/driver/sqlite` is based on mattn/go-sqlite3 (needs GCC); the pure-Go alternative is `github.com/glebarez/sqlite`.
2. **SQL compatibility must be verified yourself**. gflow's table-creation script `scripts/00.init_pg.sql` and incremental migrations in `internal/migrations` are written for MySQL/PostgreSQL and use syntax such as `CONCAT`, `CAST(... AS CHAR)`, and `row_number() OVER`; when onboarding a new database, verify each statement on the target database and rewrite where necessary. DM and KingbaseES offer MySQL/PG compatibility modes, which significantly reduce the adaptation cost.
3. **SQLite is not built in — do not set `driver: sqlite` in the main application**. The table-creation and migration SQL is incompatible with SQLite; engine unit tests run against an in-memory database through a self-registered pure-Go SQLite dialect, which is a test-only path.

## FAQ

**Startup fails with `unsupported database driver "xxx"`**

The configured `driver` has no match in the registry: check the spelling and case (matching is exact), whether the Provider's `GetSupportedDrivers()` includes that alias, and whether registration happened before `InitDatabase` (inside `init()` is recommended). The error message also lists the built-in drivers and points to the extension entry point.

**Error: `dialect provider 'xxx' is already registered`**

Duplicate dialect name: the return value of `GetName()` must be unique within the registry, and the built-in names `postgres` and `mysql` are already taken.
