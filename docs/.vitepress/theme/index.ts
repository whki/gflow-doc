import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import HomeHero from './components/HomeHero.vue'
import HomeRepos from './components/HomeRepos.vue'
import HomeCapabilities from './components/HomeCapabilities.vue'
import HomeProducts from './components/HomeProducts.vue'
import HomePreview from './components/HomePreview.vue'
import HomeDataModel from './components/HomeDataModel.vue'
import HomeArchitecture from './components/HomeArchitecture.vue'
import HomeQuickstart from './components/HomeQuickstart.vue'
import HomePricingTeaser from './components/HomePricingTeaser.vue'
import HomeCta from './components/HomeCta.vue'
import SectionHead from './components/SectionHead.vue'
import SealStamp from './components/SealStamp.vue'
import CheckMatrix from './components/CheckMatrix.vue'
import ArchDiagram from './components/ArchDiagram.vue'
import DataModelDiagram from './components/DataModelDiagram.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeHero', HomeHero)
    app.component('HomeRepos', HomeRepos)
    app.component('HomeCapabilities', HomeCapabilities)
    app.component('HomeProducts', HomeProducts)
    app.component('HomePreview', HomePreview)
    app.component('HomeDataModel', HomeDataModel)
    app.component('HomeArchitecture', HomeArchitecture)
    app.component('HomeQuickstart', HomeQuickstart)
    app.component('HomePricingTeaser', HomePricingTeaser)
    app.component('HomeCta', HomeCta)
    app.component('SectionHead', SectionHead)
    app.component('SealStamp', SealStamp)
    app.component('CheckMatrix', CheckMatrix)
    app.component('ArchDiagram', ArchDiagram)
    app.component('DataModelDiagram', DataModelDiagram)
  }
} satisfies Theme
