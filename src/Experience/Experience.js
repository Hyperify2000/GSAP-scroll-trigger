import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Camera from './Camera.js';
import Renderer from './Renderer.js';
import Sizes from './Utils/Sizes.js';
import Ground from './Ground.js';
import Assets from './Assets.js';
import { Color } from 'three';
import Car from './Car.js';

export default class Experience {
    constructor(options = {}) {
        this.targetElement = options.targetElement;
        
        if (!this.targetElement) {
            console.warn('Missing \'targetElement\' property');
            return;
        }

        this.sizes = new Sizes(this.targetElement);

        this._InitializeScene();
        this._InitializeCamera();
        this._InitializeRenderer();

        this.clock = new THREE.Clock();

        /* Car */
        this._car = new Car();
        this._scene.add(this._car.instance);
        if (this._car._cubeCamera) this._scene.add(this._car._cubeCamera);
       
        /* Light */
        let light = new THREE.DirectionalLight(0xFFFFFF, 0.75);
        light.position.y = 5;
        light.castShadow = true;
        light.shadow.bias = -0.0001;
        this._scene.add(light);

        const createSpotlight = (color, position) => {
            const spotLight1 = new THREE.SpotLight(color);
            spotLight1.intensity = 0.1;
            spotLight1.angle = 0.6;
            spotLight1.penumbra = 0.5;
            spotLight1.position.copy(position);
            spotLight1.castShadow = true;
            spotLight1.shadow.bias = -0.0001;
            this._scene.add(spotLight1);

            return spotLight1;
        }

        this.spotlights = [
            createSpotlight(0xFF40B3, new THREE.Vector3(25, 25, 0)),
            createSpotlight(0x2480FF, new THREE.Vector3(25, 25, 0)),
            createSpotlight(0x2480FF, new THREE.Vector3(0, 5, 0)),
        ];

        const ground = new Ground(new THREE.Vector3(0, 0, 0), { w: 50, h: 50 });
        this._scene.add(ground.group);

        /* GSAP */
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.defaults({
            scrub: 3,
            ease: 'none'
        });

        gsap.from(this._camera.instance.position, {
            y: 25, z: 10,
            ease: 'expo',
            duration: 3,
            onUpdate: () => this._camera.Update()
        });

        gsap.from('h1,h2', {
            yPercent: 100,
            autoAlpha: 0,
            ease: 'back',
            delay: 1
        });

        const sections = document.querySelectorAll('.section');

        this.CreateAnimation(sections[1], this._camera.instance.position, { x: 10.0, y: 0.1, z: 1.0 });
        this.CreateAnimation(sections[2], this._camera.instance.position, { x: -10.0, y: 3.0, z: -5.0 });
        this.CreateAnimation(sections[3], this._car.instance.rotation, { y: (Math.PI * 3) / 2 });

        /* Rings */
        const rings = new Array(14).fill(null).map(e => {
            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(3.35, 0.05, 16, 100),
                new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x7F7F7F })
            );

            // this._scene.add(ring);

            return ring;
        });

        for (let i = 0; i < rings.length; i++) {
            const z = (i - 7) * 3.5;
            rings[i].position.set(0, 0, -z);

            const dist = Math.abs(z);
            rings[i].scale.set(1 - dist * 0.04, 1 - dist * 0.04, 1 - dist * 0.04);

            let colorScale = 1;
            if (dist > 2) {
                colorScale = 1 - (Math.min(dist, 12) - 2) / 10;
            }
            colorScale *= 0.5;

            if (i % 2 == 1) {
                rings[i].material.emissive = new Color(6, 0.15, 0.7).multiplyScalar(colorScale);
            } else {
                rings[i].material.emissive = new Color(0.1, 0.7, 3).multiplyScalar(colorScale);
            }
        }

        // window.addEventListener('click', e => this.DEBUG(e));
        window.addEventListener('resize', () => this.Resize());
        window.requestAnimationFrame(t => this.Update(t));
    }

    CreateAnimation(trigger, target, options) {
        if (!trigger) {
            console.warn('No trigger specified!');
            return;
        }

        if (!target) {
            console.warn('No target specified!');
            return;
        }

        const timeline = gsap.timeline({ scrollTrigger: { trigger, start: 'top top', end: 'bottom bottom' } })
        .fromTo(target, {}, {
            x: options?.x ?? 0, y: options?.y ?? 0, z: options?.z ?? 0,
            onUpdate: () => this._camera.Update(),
            scrollTrigger: {
                trigger,
                end: 'bottom bottom'
            }
        }, 'same');

        return timeline;
    }

    DEBUG(e) {
        if (!this._car) return;

        const raycaster = new THREE.Raycaster();

        const pointer = new THREE.Vector2(
            (e.clientX / this._renderer.instance.domElement.offsetWidth) * 2 - 1,
            -(e.clientY / this._renderer.instance.domElement.offsetHeight) * 2 + 1
        );

        raycaster.setFromCamera(pointer, this._camera.instance);

        const intersect = raycaster.intersectObject(this._car.instance)[0];

        if (!intersect) return;

        console.log(intersect.object.material.name);

        const pos = intersect.object.position;

        intersect.object.material.color.setHex(0xFF0000);
    }

    _InitializeScene() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0x000000);
    }

    _InitializeCamera() {
        this._camera = new Camera(25, this.sizes.width / this.sizes.height, 0.1, 150);
    }

    _InitializeRenderer() {
        this._renderer = new Renderer(this._scene, this._camera.instance, { antialias: true });
        this.targetElement.appendChild(this._renderer.instance.domElement);
        this._renderer.InitializePostFX();
    }

    Resize() {
        this.sizes.Resize();
        this._camera.Resize();
        this._renderer.Resize();
    }

    Update(t) {
        window.requestAnimationFrame(t => this.Update(t));

        const deltaT = this.clock.getDelta();
        const elapsedT = this.clock.getElapsedTime();

        if (this._car._cubeCamera) this._car._cubeCamera.update(this._renderer.instance, this._scene);

        if (this._composer) this._composer.render();
        else this._renderer.Update();

        for (let i = 0; i < this.spotlights.length; i++) {
            this.spotlights[i].position.x += Math.sin(elapsedT * 0.1);
            this.spotlights[i].position.z += Math.cos(elapsedT * 0.1);
        }

        this._camera.Update();
    }
}