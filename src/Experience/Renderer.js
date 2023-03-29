import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Sizes from './Utils/Sizes.js';

class Renderer {
    constructor(scene, camera, params={}) {
        if (!scene) {
            console.warn('Renderer: Scene not specified!');
            return;
        }

        if (!camera) {
            console.warn('Renderer: Camera not specified!');
            return;
        }

        this._scene = scene;
        this._camera = camera;

        this.sizes = new Sizes();

        this.instance = new THREE.WebGLRenderer(params);
        this.instance.setClearColor(0x000000, 1.0);
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(window.devicePixelRatio);
        this.instance.outputEncoding = THREE.sRGBEncoding;
        // this.instance.toneMapping = THREE.ACESFilmicToneMapping;
        this.instance.toneMapping = THREE.NoToneMapping;
        this.instance.toneMappingExposure = 2.3;
        this.instance.toneMappingExposure = 1;

        this.instance.gammaInput = true;
        this.instance.gammeOutput = true;
    }

    InitializePostFX() {
        this._composer = new EffectComposer(this.instance);
        this._composer.addPass(new RenderPass(this._scene, this._camera));
        // this._composer.addPass(new UnrealBloomPass({ x: 1024, y: 1024 }, 1.0, 0.0, 0.0));
        this._composer.addPass(new UnrealBloomPass({ x: 1024, y: 1024 }, 1.0, 0.5, 0.25));
    }

    Resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(window.devicePixelRatio);
    }

    Update() {
        if (this._composer) this._composer.render();
        else this.instance.render(this._scene, this._camera);
    }
}

export default Renderer;