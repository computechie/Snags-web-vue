<p align="center">
  <a href="#">
    <img width="150" src="https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/vue-versions-logo.png" alt="Vue-Versions logo">
  </a>
</p>

<p align="center">
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X42PBTBVWZSUJ" target="_blanc">
    <img src="https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/paypal-badge.svg" alt="Donate With PayPal">
  </a>
  <a href="#" target="_blanc">
    <img src="https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/stability-badge.png" alt="Stable">
  </a>
  <a href="#" target="_blanc">
    <img src="https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/npm-version-badge.png" alt="NPM Version">
  </a>
  <a href="https://github.com/yveyeh/vue-versions/blob/master/LICENSE" target="_blanc">
    <img src="https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/license-badge.png" alt="License">
  </a>
</p>
  <!-- [![stable](https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/stability-badge.png)](#)
  [![npm](https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/npm-version-badge.png)](#)
  [![license](https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/license-badge.png)](#) -->

<p align="center" style="font-size: 36px !important; font-weight: 600 !important;"> Vue-Versions </p>

**vue-versions** is a module to provide the installed Vue full version as in (x.y.z) and the individual major (x), minor(y), and patch(z) as well. It is useful for community plugins and components with different implementations for different versions of Vue.js.

## Dependencies

- **dependencies (1)**: [vue](https://www.npmjs.com/package/vue).

- **devDependencies (5)**: [@types/node](https://www.npmjs.com/package/@types/node), [terser](https://www.npmjs.com/package/terser), [typescript](https://www.npmjs.com/package/typescript).

## Installation and Usage

- **Installation**

    - With NPM:
    ```bash
    $ npm i vue-versions
    ```

    - With Yarn:
    ```bash
    $ yarn add vue-versions
    ```

- **Usage**

    ```ts
    import { Vue, Component } from 'vue-property-decorator';
    import VueVersions from 'vue-versions';

    @Component({ template: require('[PATH_TO_TEMPLATE]') })

    export default class [CLASS_NAME] extends Vue {

        public vs: VueVersions = new VueVersions();

        mounted() {
            console.log(this.vs.getVersionNumber(Vue));
            console.log(this.vs.getVersionNumber(Vue, 'major'));
            console.log(this.vs.getVersionNumber(Vue, 'minor'));
            console.log(this.vs.getVersionNumber(Vue, 'patch'));
            this.vs.getVersionNumber(Vue, 'test'); // should throw an error in the console.
        }

    }
    ```


## Contributors

- :headphones: :woman: [Ndi Britha Lea](https://github.com/NdiBrithaLea). :art: :loudspeaker:
- :headphones: :man: [Yufenyuy Veyeh Didier](https://github.com/yveyeh). :computer: :books: :pencil:

<br>
:loudspeaker:: Awareness, :pencil:: Blogposts, :computer:: Code, :art:: Design, :books:: Documentation. 


## Support vue-versions :gift: :credit_card:

We will be very grateful if you support the project with anything you have, and can.<br> It will help us with a few resources we need in order to keep improving the project and also to provide more useful components and plugins. We will also display your logo and organization name in the **Financial Contributors** section below. 

<p align="center">
  <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X42PBTBVWZSUJ" target="_blanc">
    <img src="https://raw.githubusercontent.com/yveyeh/vue-version/master/assets/paypal-donate-button.png" alt="Donate With PayPal"/>
  </a>
</p>

<p align="center">  Or <br><br> </p>

<p align="center">
  <a href="https://www.buymeacoffee.com/05tyxSJ" target="_blank">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee">
  </a>
</p>
<!-- [![paypal](https://raw.githubusercontent.com/yveyeh/vue-versions/master/assets/paypal-donate-button.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=X42PBTBVWZSUJ)

<!-- Or<br><br>

[![Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/05tyxSJ) -->



- **Financial Contributors:**
<!--  -->


## License

The MIT License ([MIT](https://github.com/yveyeh/vue-versions/blob/master/LICENSE)).

Copyright (c) 2020, [Yufenyuy Veyeh Didier](https://github.com/yveyeh).