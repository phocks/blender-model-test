import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function main() {
  const canvas = document.querySelector("#canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.outputEncoding = THREE.sRGBEncoding;

  const fov = 45;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "https://threejs.org/manual/examples/resources/images/checker.png"
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    scene.add(mesh);
  }

  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 0.6;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xffffff;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 2);
    scene.add(light);
    scene.add(light.target);
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "./pool.glb",
      (gltf) => {
        const root = gltf.scene;
        scene.add(root);

        // compute the box that contains all the stuff
        // from root and below
        const box = new THREE.Box3().setFromObject(root);

        const boxSize = box.getSize(new THREE.Vector3()).length();
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

        // update the Trackball controls to handle the new size
        controls.maxDistance = boxSize * 10;
        controls.target.copy(boxCenter);
        controls.update();
      }
    );
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

// import * as THREE from 'three';
// import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
// import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';

// export function main() {
//   const canvas = document.querySelector("#canvas");
//   const renderer = new THREE.WebGLRenderer({ canvas });
//   renderer.outputEncoding = THREE.sRGBEncoding;

//   const fov = 45;
//   const aspect = 2; // the canvas default
//   const near = 0.1;
//   const far = 100;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.set(0, 10, 20);

//   const controls = new OrbitControls(camera, canvas);
//   controls.target.set(0, 5, 0);
//   controls.update();

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color("black");

//   {
//     const planeSize = 40;

//     const loader = new THREE.TextureLoader();
//     const texture = loader.load(
//       "https://threejs.org/manual/examples/resources/images/checker.png"
//     );
//     texture.encoding = THREE.sRGBEncoding;
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.magFilter = THREE.NearestFilter;
//     const repeats = planeSize / 2;
//     texture.repeat.set(repeats, repeats);

//     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
//     const planeMat = new THREE.MeshPhongMaterial({
//       map: texture,
//       side: THREE.DoubleSide,
//     });
//     const mesh = new THREE.Mesh(planeGeo, planeMat);
//     mesh.rotation.x = Math.PI * -0.5;
//     scene.add(mesh);
//   }

//   {
//     const skyColor = 0xb1e1ff; // light blue
//     const groundColor = 0xb97a20; // brownish orange
//     const intensity = 0.6;
//     const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
//     scene.add(light);
//   }

//   {
//     const color = 0xffffff;
//     const intensity = 0.8;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(0, 10, 0);
//     light.target.position.set(-5, 0, 0);
//     scene.add(light);
//     scene.add(light.target);
//   }

//   {
//     const gltfLoader = new GLTFLoader();
//   const url = 'resources/models/cartoon_lowpoly_small_city_free_pack/scene.gltf';
//   gltfLoader.load(url, (gltf) => {
//     const root = gltf.scene;
//     scene.add(root);
//   }

//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   function render() {
//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement;
//       camera.aspect = canvas.clientWidth / canvas.clientHeight;
//       camera.updateProjectionMatrix();
//     }

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }

// main();

// export function main() {
//   const canvas = document.querySelector("#canvas");
//   const renderer = new THREE.WebGLRenderer({ canvas });

//   const fov = 45;
//   const aspect = 2; // the canvas default
//   const near = 0.1;
//   const far = 100;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.set(0, 10, 20);

//   const controls = new OrbitControls(camera, canvas);
//   controls.target.set(0, 5, 0);
//   controls.update();

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color("black");

//   {
//     const planeSize = 40;

//     const loader = new THREE.TextureLoader();
//     const texture = loader.load(
//       "https://threejs.org/manual/examples/resources/images/checker.png"
//     );
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.magFilter = THREE.NearestFilter;
//     const repeats = planeSize / 2;
//     texture.repeat.set(repeats, repeats);

//     const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
//     const planeMat = new THREE.MeshPhongMaterial({
//       map: texture,
//       side: THREE.DoubleSide,
//     });
//     const mesh = new THREE.Mesh(planeGeo, planeMat);
//     mesh.rotation.x = Math.PI * -0.5;
//     scene.add(mesh);
//   }
//   {
//     const cubeSize = 4;
//     const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
//     const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
//     const mesh = new THREE.Mesh(cubeGeo, cubeMat);
//     mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
//     scene.add(mesh);
//   }
//   {
//     const sphereRadius = 3;
//     const sphereWidthDivisions = 32;
//     const sphereHeightDivisions = 16;
//     const sphereGeo = new THREE.SphereGeometry(
//       sphereRadius,
//       sphereWidthDivisions,
//       sphereHeightDivisions
//     );
//     const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
//     const mesh = new THREE.Mesh(sphereGeo, sphereMat);
//     mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
//     scene.add(mesh);
//   }

//   interface ColorGUIHelper {
//     object: THREE.Light;
//     prop: string;
//   }

//   class ColorGUIHelper {
//     constructor(object, prop) {
//       this.object = object;
//       this.prop = prop;
//     }
//     get value() {
//       return `#${this.object[this.prop].getHexString()}`;
//     }
//     set value(hexString) {
//       this.object[this.prop].set(hexString);
//     }
//   }

//   {
//     const color = 0xffffff;
//     const intensity = 1;
//     const light = new THREE.AmbientLight(color, intensity);
//     scene.add(light);

//     const gui = new GUI();
//     gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
//     gui.add(light, "intensity", 0, 2, 0.01);
//   }

//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   function render() {
//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement;
//       camera.aspect = canvas.clientWidth / canvas.clientHeight;
//       camera.updateProjectionMatrix();
//     }

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }
