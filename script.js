"use strict";

function main() {
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var translationLocation = gl.getUniformLocation(program, "u_translation");

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set data geometri
    setGeometry(gl);

    var translation = [0, 0];
    var color = [Math.random(), Math.random(), Math.random(), 1];

    drawScene();

    // Setup ui slider translasi
    webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});

    function updatePosition(index) {
        return function(event, ui) {
            translation[index] = ui.value;
            drawScene();
        };
    }

    // Fungsi menggambar
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Convert clip ke pixel
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Jalankan program
        gl.useProgram(program);

        // Turn on atribut
        gl.enableVertexAttribArray(positionLocation);

        // Bind posisi geometri
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        var size = 2;         
        var type = gl.FLOAT;   
        var normalize = false; 
        var stride = 0;        
        var offset = 0;        
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        // set resolusi
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        // set warna
        gl.uniform4fv(colorLocation, color);

        // Set translasi
        gl.uniform2fv(translationLocation, translation);

        // Gambarkan geometri
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 18;  // Terdapat 18 titik yang menjadi lokasi koordinat titik penggambar "F"
        gl.drawArrays(primitiveType, offset, count);
    }
}

// Isi buffer dengan lokasi koordinat titik penggambar "F"
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // Kolom kiri
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,

            // Baris atas
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,

            // Baris tengah
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ]),
        gl.STATIC_DRAW);
}

main();
