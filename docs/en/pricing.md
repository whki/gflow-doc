---
sidebar: false
aside: false
---

<script setup>
// SealStamp is registered globally in the theme
</script>

<div class="pricing-hero">
  <div class="pricing-title">
    <h1>Open Source Is Free, Commercial Pricing Is Clear</h1>
    <div class="pricing-seal"><SealStamp :size="76" /></div>
  </div>
  <p>The GFlow Workflow Platform is <s class="price-was">¥15,000</s> <b class="price-now">50% off at ¥7,500</b> — a limited-time one-time buyout with full source code delivered: an approval work platform + rule orchestration platform + AI agent platform, three platforms in one.<br/>The GFlow Engine is open source forever (Apache-2.0) — no annual fees, no per-seat billing, no feature black boxes, no license verification server.</p>
</div>

<div class="pricing-table-wrap">

<table class="price-table">
  <thead>
    <tr>
      <th style="width:46%">Capability</th>
      <th style="width:27%">Open Source GFlow Engine</th>
      <th style="width:27%" class="col-paid">Commercial GFlow Platform<span class="pt-tag">Recommended</span></th>
    </tr>
  </thead>
  <tbody>
    <tr><td colspan="3" class="price-section-title">Approval core (identical in both editions)</td></tr>
    <tr><td>OR-sign / countersign (parallel · sequential, unanimous · majority · percentage · vote count)</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>Add-sign / remove-sign / transfer / delegate / claim & grab</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>Return to previous node / return to initiator / withdraw / suspend & resume / timeout reminders / CC</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>Conditional / parallel / inclusive branches (switch · fork · join · inclusive)</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>Subprocesses / service tasks / HTTP calls / delay-wait / aiAgent nodes</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td>Process definition versioning / multi-tenant / REST API · Go API</td><td class="pt-yes">✓</td><td class="pt-yes">✓</td></tr>
    <tr><td colspan="3" class="price-section-title">Four in-house designers / AI agents (commercial edition only)</td></tr>
    <tr><td>Process Designer</td><td class="pt-no">— hand-write process DSL</td><td class="pt-yes">✓ Tree-style visual orchestration</td></tr>
    <tr><td>Form Designer</td><td class="pt-no">— implement it yourself</td><td class="pt-yes">✓ gform-designer + template library</td></tr>
    <tr><td>Rule Chain Designer</td><td class="pt-no">— hand-write rule chain JSON</td><td class="pt-yes">✓ visually orchestrate automation rule chains</td></tr>
    <tr><td>AI Agent (AI approval)</td><td class="pt-no">— implement it yourself</td><td class="pt-yes">✓ model / agent / skill management</td></tr>
    <tr><td colspan="3" class="price-section-title">Product-grade capabilities (commercial edition only)</td></tr>
    <tr><td>Frontend app</td><td class="pt-no">— build your own</td><td class="pt-yes">✓ initiate / todo / done / CC / stats / tracking</td></tr>
    <tr><td>Automation orchestration UI</td><td class="pt-no">— implement it yourself</td><td class="pt-yes">✓ triggers + HTTP / service task configuration</td></tr>
    <tr><td>Organization / users / roles / positions</td><td class="pt-no">— implement IdentityService yourself</td><td class="pt-yes">✓ full admin backend</td></tr>
    <tr><td>Monitoring / notifications / operation audit</td><td class="pt-no">— build your own from listener callbacks</td><td class="pt-yes">✓ built in</td></tr>
    <tr><td>Multi-instance cluster deployment</td><td class="pt-no">— lock / rescue primitives built in, wiring is yours</td><td class="pt-yes">✓ dual-instance active-active · leader election / auto rescue / hot config reload</td></tr>
    <tr><td colspan="3" class="price-section-title">Delivery & services</td></tr>
    <tr><td>License</td><td>Apache-2.0</td><td>Commercial license (one-time)</td></tr>
    <tr><td>Deliverables</td><td>Open source repository</td><td>Full source code for server + frontend</td></tr>
    <tr><td>Code restrictions</td><td>None</td><td>No encryption / no obfuscation / no verification server</td></tr>
    <tr><td>Technical support</td><td>Community issues</td><td>One year of remote support · ticket-based response</td></tr>
    <tr><td>Price</td><td><b>¥ 0</b></td><td class="col-paid"><s class="pt-was">¥ 15,000</s> <b>¥ 7,500 one-time</b><span class="pt-tag">50% OFF</span></td></tr>
  </tbody>
</table>

<div class="price-actions">
  <a class="gf-btn gf-btn-primary" href="http://8.134.32.225:8081" target="_blank" rel="noopener">Explore the live demo →</a>
  <a class="gf-btn gf-btn-ghost ghost-light" href="https://gitee.com/rulego/gflow-engine" target="_blank" rel="noopener">Get the source on Gitee</a>
</div>

</div>

## Frequently Asked Questions

**Q: Can I use the open source edition directly?**

Yes. The engine, the REST API, and the full set of approval semantics are all open source. However, you need to hand-write your process JSON following the [DSL specification](/en/guide/dsl) and implement `IdentityService` and the frontend pages yourself — a good fit for teams that already have a system and only want to add approval capabilities.

**Q: Are there any further costs beyond ¥7,500?**

No. It is a one-time buyout that includes one year of technical support. From the second year onward you can optionally renew maintenance to get priority support on new versions; if you do not renew, the delivered code is yours forever.

**Q: How long does the 50% off discount last?**

The price returns to ¥15,000 when the promotion ends. Purchases completed during the promotion are locked in at the one-time ¥7,500 buyout — delivered licenses and source code are never affected by future price changes.

**Q: How do code update rights work?**

The engine (GFlow Engine) is open source, with free code updates forever. For the commercial edition, platform versions released within 12 months of purchase are free to obtain (new features + bug fixes, in sync with open source engine upgrades); after that you can optionally renew to keep receiving platform updates. Whether or not you renew, the delivered code remains yours forever and keeps running as usual — you simply stop receiving new platform versions.

**Q: How is the license counted? By number of servers? By users?**

Neither. One license covers any internal deployment, with no limit on instances and no limit on users.

**Q: Can I modify the source code I receive?**

Yes. Modify the UI, the processes, even the engine — no encryption, no obfuscation, no runtime license checks. Even if the vendor disappears, the system keeps running.

**Q: Can I distribute the source code to customers or third parties?**

No. The commercial license is limited to the purchaser's own use, and the source code must not be distributed externally. Providing services to others (SaaS, internal deployments) is completely unaffected — as long as you do not hand the source code over to your customers. Note: if buyer A distributes the source code to B, then B must also obtain a separate license from us.

**Q: Can you issue invoices? Do you accept corporate bank transfers?**

Yes. Contact sales to get a quotation and a contract.

**Q: If the engine upgrades in the future, will the commercial edition keep up?**

GFlow Platform and GFlow Engine evolve on the same core, and the commercial license includes synchronized engine updates.

## Contact Sales

- **Demo environment**: <http://8.134.32.225:8081> (admin / admin123)
- **QQ**: [2215016127](tencent://message/?uin=2215016127&Site=&Menu=yes)
- **WeChat**: `rulegoteam`
- **Email**: [rulego@outlook.com](mailto:rulego@outlook.com)
- **Gitee**: [rulego/gflow-engine](https://gitee.com/rulego/gflow-engine)

> When reaching out, please let us know what you need (GFlow commercial edition purchase / licensing inquiry).

<style scoped>
/* Tighten the top padding of the VitePress content container so no large gap
   is left between the header seal and the navbar */
:global(.VPContent .container:has(.pricing-hero)) {
  padding-top: 8px;
}

/* VitePress defaults sidebar-less pages to .container 1104px / .content 784px,
   which squeezes the comparison table to 744px and causes heavy wrapping;
   widen it here to match the table width */
:global(.VPDoc:has(.pricing-hero) .container) {
  max-width: 1280px !important;
}

:global(.VPDoc:has(.pricing-hero) .content) {
  max-width: 100% !important;
}

.pricing-hero {
  text-align: center;
  padding: 4px 20px 0;
}

.pricing-hero h1 {
  font-family: var(--gf-serif);
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 900;
  margin: 14px 0 12px;
}

/* The seal sits at the top-right of the title without taking up its own line */
.pricing-title {
  position: relative;
  display: inline-block;
}

.pricing-seal {
  position: absolute;
  top: -22px;
  right: -92px;
  opacity: 0.9;
}

@media (max-width: 820px) {
  .pricing-seal {
    display: none;
  }
}

.pricing-hero p {
  font-size: 15.5px;
  line-height: 1.9;
  opacity: 0.72;
  margin: 0 auto 8px;
  max-width: 860px;
}

/* Hero strikethrough original price + discounted price */
.price-was {
  color: #8a8577;
}

.price-now {
  color: var(--gf-seal);
  font-size: 17px;
}

/* Price row in the comparison table: mute the struck-through original price */
.pt-was {
  font-weight: 400;
  color: #8a8577;
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(194, 55, 47, 0.55);
}

/* Comparison table body: widen to a width that fits the viewport, keep cells
   on one line, and reduce the overall height */
.pricing-table-wrap {
  max-width: 1240px;
  margin: 32px auto 56px;
  padding: 0 20px;
  overflow-x: auto;
}

.price-actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

:global(h2) {
  font-family: var(--gf-serif);
}
</style>
