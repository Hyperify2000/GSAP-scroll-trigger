import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import Assets from './Assets.js';

import Sizes from './Utils/Sizes.js';

class Ground {
    constructor(
        position = {x: 0, y: 0, z: 0},
        options = { w: 50, y: 50}
    ) {
        this.width = options.w;
        this.height = options.h;

        this.sizes = new Sizes();

        /* Main ground mesh */
        this.mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(this.width, this.height),
            new THREE.MeshBasicMaterial({
                color: 0x000000, transparent: true, opacity: 0.75, side: THREE.DoubleSide })
        );
        this.mesh.position.copy(position);
        this.mesh.rotation.x -= Math.PI / 2;

        /* Reflection */
        this.reflector = new Reflector(new THREE.PlaneGeometry(this.width, this.height), {
            clipBias: 0.003,
            textureWidth: this.sizes.width * window.devicePixelRatio,
            textureHeight: this.sizes.height * window.devicePixelRatio,
            color: 0x777777
        });
        this.reflector.position.set(
            position.x, position.y - 0.05, position.z);
        this.reflector.rotation.x -= Math.PI / 2;

        /* Grid */
        const diffuse = Assets[1].data;
        diffuse.wrapS = THREE.RepeatWrapping;
        diffuse.wrapT = THREE.RepeatWrapping;
        diffuse.anisotropy = 4;
        diffuse.repeat.set(30, 30);
        diffuse.offset.set(0, 0);

        this.grid = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.15, map: diffuse, alphaMap: diffuse, transparent: true })
        );
        this.grid.position.set(position.x, position.y + 0.01, position.z);
        this.grid.rotation.x -= Math.PI / 2;

        /* Group */
        this.group = new THREE.Group();
        this.group.add(this.mesh);
        this.group.add(this.reflector);
        // this.group.add(this.grid);
    }
}

export default Ground;