/**
 * Three.js 공통 import 모듈 (Three.js common import module)
 * 
 * Three.js 중복 import 경고를 방지하기 위해 한 곳에서만 import합니다.
 * To prevent multiple Three.js import warnings, we import from a single location.
 */

export { 
  WebGLRenderer, 
  Scene, 
  OrthographicCamera, 
  Clock, 
  Vector2, 
  ShaderMaterial, 
  PlaneGeometry, 
  Mesh 
} from "three";
