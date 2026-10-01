# 3D Laboratory

## Purpose

3D is an inspection and teaching interface.

## Stack

Three.js
React Three Fiber
Drei

## Features

- orbit camera
- zoom
- reset
- component selection
- hotspots
- pin inspection
- annotation
- optional exploded view
- fullscreen
- mobile gestures

## Performance

3D route must be lazy-loaded.

GLB/GLTF preferred.

Optimize geometry.

Compress textures.

Use Draco/Meshopt where beneficial.

Cap DPR on constrained devices.

Pause rendering where practical.

Respect reduced motion.

Provide WebGL fallback.

## Progressive Enhancement

The educational content must remain accessible without the 3D renderer.

3D complements documentation; it does not contain the only copy of critical
information.
