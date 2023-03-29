import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class Loader {
    static instance;

    constructor() {
        if (Loader.instance) return Loader.instance;

        Loader.instance = this;
    }

    Load(path) {
        return new Promise((res, rej) => {
            if (!path || path == '')
                err('Path is incorrect or not specified!');

            const ext = path.match(/\.[a-z]+$/)[0];
            const ext_types = ['.glb', '.gltf', '.png', '.jpg'];

            if (ext_types.findIndex(t => t == ext) < 0)
                err('Not valid file extension!');

            if (ext == ".glb" || ext == ".gltf") {
                const loader = new GLTFLoader();
                loader.load(path, model => {
                    res(model?.scene ?? model);
                }, undefined, rej);
            }

            if (ext == '.png' || ext == '.jpg') {
                const loader = new THREE.TextureLoader();
                loader.load(path, res, undefined, rej);
            }
        });
    }

    LoadAll(items, cb) {
        if (!items) return;

        Promise.all(items.map(item => this.Load(item.path)))
            .then(res => cb(res))
            .catch(console.err);
    }
}

export default Loader;