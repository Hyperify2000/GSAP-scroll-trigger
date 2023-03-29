import * as THREE from 'three';
import Assets from "./Assets.js";

class Car {
    constructor(position={x:0,y:0,z:0}) {
        this.instance = Assets[0].data;
        this.instance.position.copy(position);
        
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
        // this._cubeCamera = new THREE.CubeCamera( 1, 150, cubeRenderTarget );
        // this._cubeCamera.position.set(0, 0, 0);

        this.instance.traverse(c => {
                
    
            if (c instanceof THREE.Mesh) {
                const mat = c.material;

                if (/pearl|leather|brake|matte/i.test(mat.name)) return;
    
                mat.metalness = 0.9;
                mat.roughness = 0.2;
                // mat.reflectivity = 1.0;
                mat.clearCoat = 1.0;
                mat.clearCoatRoughness = 0.0;
                mat.thickness = 5;
                mat.envMapIntensity = 25.0;
                mat.envMap = cubeRenderTarget.texture;
    
                c.receiveShadow = true;
                c.castShadow = true;
            }
        });
    }
}

export default Car;