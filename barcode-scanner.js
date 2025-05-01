/*
  barcode-scanner.js
  This file integrates the QuaggaJS barcode scanning library for barcode detection.
  It exports a function to start scanning and a function to stop scanning.
*/

import Quagga from 'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js';

export function startBarcodeScanner(onDetected) {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#camera-stream'),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "upc_reader", "upc_e_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        if (result && result.codeResult && result.codeResult.code) {
            onDetected(result.codeResult.code);
        }
    });
}

export function stopBarcodeScanner() {
    Quagga.stop();
    Quagga.offDetected();
}
