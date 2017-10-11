var gl;
function initGL(canvas){
    try{
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch(e){
        console.log("error getting canvas context");
    }
    // only continue if webGL is avaliable and working
    if(!gl){
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
}

function getShader(gl, id){
    var shaderScript = document.getElementById(id);
    if(!shaderScript){
        console.log("id not found");
        return null;
    }

    // extract the text contents of the script div in main.html
    var str = "";
    var k = shaderScript.firstChild;
    while(k){
        if(k.nodeType==3){
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    // create shader
    var shader;
    if(shaderScript.type == "x-shader/x-fragment"){
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if(shaderScript.type == "x-shader/x-vertex"){
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        console.log("shader not found");
        return null;
    }

    // set source
    gl.shaderSource(shader,str);
    // compile shader
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var shaderProgram;
function initShaders(){
    var fragmentShader = getShader(gl,"shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // create program
    shaderProgram = gl.createProgram();
    // attach shaders to program
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    // link program
    gl.linkProgram(shaderProgram);

    // check for any errors in linking
    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
        alert("Error initailizing shaders");
    }

    // set current shader program
    gl.useProgram(shaderProgram);

    // get the location of the vertex position in the shader
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    // enable vertex array
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    // set programs projection and modelview matrix
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram,"uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram,"uMVMatrix");
}

var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;
var triangleVerts = [
    0, 1, 0,
    -1, -1, 0,
    1, -1, 0
];
var squareVerts=[
    1, 1, 0,
    -1, 1, 0,
    1, -1, 0,
    -1, -1, 0,
];

function initBuffers(){
    // setup triangle
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerts), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    // setupt square
    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVerts), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}

function setMatrixUniforms(){
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform,false,pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform,false,mvMatrix);
}

function drawScene(){
    // set viewport
    gl.viewport(0,0, gl.viewportWidth, gl.viewportHeight);
    // clear depth and color buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // set perspective into pMatrix
    var verticalFieldOfView = 45; // in degrees
    var ratio = gl.viewportWidth/gl.viewportHeight;
    var nearClip = 0.1;
    var farClip = 100.0;
    mat4.perspective(verticalFieldOfView,ratio,nearClip,farClip, pMatrix);
    // set model view to identity
    mat4.identity(mvMatrix);
    // translate
    var translation = [-1.5,0.0,-7.0];
    mat4.translate(mvMatrix,translation);
    // bind tris buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,triangleVertexPositionBuffer);
    // pass position to shader
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    // use current ModelViewProjection (MVP) matrix
    setMatrixUniforms();
    // draw the triangle
    gl.drawArrays(gl.TRIANGLES,0,triangleVertexPositionBuffer.numItems);
}

function webGLStart(){
    var canvas = document.getElementById("glCanvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}
// start!
webGLStart();