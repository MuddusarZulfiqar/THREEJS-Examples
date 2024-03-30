import * as THREE from "three";
// Texture Loader
const textureLoader = new THREE.TextureLoader();
function createPlanet(scene,size, texture, position, ring) {
    //Doing the exact same thing to set the color the colorSpace of the planet's texture
    const map = textureLoader.load(texture);
    map.colorSpace = THREE.SRGBColorSpace;
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: map
    });
    const mesh = new THREE.Mesh(geo, mat);
    const obj = new THREE.Object3D();
    obj.add(mesh);
    if(ring) {
        //Doing the exact same thing to set the color the colorSpace of the ring's texture
        const ringMap = textureLoader.load(ring.texture);
        ringMap.colorSpace = THREE.SRGBColorSpace;
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: ringMap,
            side: THREE.DoubleSide
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = position;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }
    scene.add(obj);
    mesh.position.x = position;
    return {mesh, obj}
}


module.exports = {createPlanet}