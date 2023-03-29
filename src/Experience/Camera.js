import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Sizes from './Utils/Sizes.js';

class Camera {
    constructor(fov=25, aspect, near=0.1, far=100) {
        if (!aspect) {
            console.warn('Camera: No aspect ratio specified!');
            return;
        }

        this.sizes = new Sizes();

        this.instance = new THREE.PerspectiveCamera(
            fov, aspect, near, far);

        this.instance.position.set(0, 4, 8);
        this.instance.rotation.order = 'YXZ';
    
        this._controls = new OrbitControls(this.instance, this.sizes.targetElement);
        this._controls.screenSpacePanning = true;
        this._controls.zoomSpeed = 0.25;
        this._controls.enableRotate = false;
        this._controls.enableZoom = false;
        this._controls.enablePan = false;
        this._controls.enableDamping = true;
        // this._controls.autoRotate = true;
        this._controls.update();
    }

    Resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    Update() {
        this.instance.updateProjectionMatrix();
        this._controls.update();
    }
}

export default Camera;