import struct
import json
import os

def build_coin_glb():
    blend_path = 'aurevant-production/public/images/3d images/roman-coin/source/untitled.blend'
    tex_path = 'aurevant-production/public/images/3d images/roman-coin/textures/image00422.jpg'
    out_glb_path = 'aurevant-production/public/images/3d images/roman-coin/scene.glb'

    with open(blend_path, 'rb') as f:
        # 64 vertices * 20 bytes at 643300
        f.seek(643300)
        verts = []
        for _ in range(64):
            x, y, z = struct.unpack('<3f', f.read(12))
            f.seek(8, 1)
            # Authentic coin proportions:
            # Diameter = 2.0 (X, Y in [-1.0, 1.0])
            # Genuine coin thickness = 0.10629 (Z in [-0.053147, 0.053147])
            # Front obverse face at Z = +0.053147, Reverse at Z = -0.053147
            # Unmirrored: Emperor Domitian facing right
            verts.append((x, y, 0.053146768 * z))

        # 192 loop UVs * 12 bytes at 646140
        f.seek(646140)
        uvs = []
        for _ in range(192):
            u, v = struct.unpack('<2f', f.read(8))
            f.seek(4, 1)
            # glTF UVs have v flipped: 1.0 - v
            uvs.append((u, 1.0 - v))

        # 192 loops * 8 bytes at 648468
        f.seek(648468)
        loops = []
        for _ in range(192):
            v_idx, e_idx = struct.unpack('<2i', f.read(8))
            loops.append(v_idx)

        # 34 polys * 12 bytes at 650156
        f.seek(650156)
        polys = []
        for _ in range(34):
            lstart, totloop, mat_nr, flag, pad = struct.unpack('<2ih2c', f.read(12))
            polys.append((lstart, totloop))

    with open(tex_path, 'rb') as f:
        tex_bytes = f.read()

    # Triangulate polygons into unique vertices (position, normal, uv)
    tri_positions = []
    tri_uvs = []

    for lstart, totloop in polys:
        # Fan triangulation with standard CCW winding
        poly_loops = [lstart + i for i in range(totloop)]
        for i in range(1, totloop - 1):
            for l_idx in [poly_loops[0], poly_loops[i], poly_loops[i + 1]]:
                v_idx = loops[l_idx]
                tri_positions.append(verts[v_idx])
                tri_uvs.append(uvs[l_idx])

    num_vertices = len(tri_positions)
    indices = list(range(num_vertices))

    # Compute flat normals per triangle pointing outwards
    tri_normals = []
    for i in range(0, num_vertices, 3):
        p0 = tri_positions[i]
        p1 = tri_positions[i+1]
        p2 = tri_positions[i+2]
        # cross product (p1 - p0) x (p2 - p0)
        ux, uy, uz = p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]
        vx, vy, vz = p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]
        nx = uy*vz - uz*vy
        ny = uz*vx - ux*vz
        nz = ux*vy - uy*vx
        length = (nx*nx + ny*ny + nz*nz)**0.5 or 1.0
        norm = (nx/length, ny/length, nz/length)
        tri_normals.extend([norm, norm, norm])

    # Pack binary buffers
    pos_bin = bytearray()
    norm_bin = bytearray()
    uv_bin = bytearray()
    idx_bin = bytearray()

    for p in tri_positions:
        pos_bin.extend(struct.pack('<3f', *p))
    for n in tri_normals:
        norm_bin.extend(struct.pack('<3f', *n))
    for uv in tri_uvs:
        uv_bin.extend(struct.pack('<2f', *uv))
    for idx in indices:
        idx_bin.extend(struct.pack('<H', idx))

    # Pad each bufferView to 4-byte boundary
    def pad4(b):
        pad = (4 - (len(b) % 4)) % 4
        return b + b'\x00' * pad

    pos_bin = pad4(pos_bin)
    norm_bin = pad4(norm_bin)
    uv_bin = pad4(uv_bin)
    idx_bin = pad4(idx_bin)
    tex_padded = pad4(tex_bytes)

    # Calculate offsets
    idx_offset = 0
    pos_offset = len(idx_bin)
    norm_offset = pos_offset + len(pos_bin)
    uv_offset = norm_offset + len(norm_bin)
    tex_offset = uv_offset + len(uv_bin)

    total_bin = idx_bin + pos_bin + norm_bin + uv_bin + tex_padded

    min_x = min(p[0] for p in tri_positions)
    max_x = max(p[0] for p in tri_positions)
    min_y = min(p[1] for p in tri_positions)
    max_y = max(p[1] for p in tri_positions)
    min_z = min(p[2] for p in tri_positions)
    max_z = max(p[2] for p in tri_positions)

    gltf_dict = {
        "asset": {
            "generator": "Aurevant Ancient Coin Engine (Blender SDNA Exact Proportions)",
            "version": "2.0"
        },
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0, "name": "AncientRomanCoin"}],
        "materials": [
            {
                "name": "RomanAureusGold",
                "pbrMetallicRoughness": {
                    "baseColorTexture": {"index": 0},
                    "metallicFactor": 0.88,
                    "roughnessFactor": 0.32
                },
                "doubleSided": True
            }
        ],
        "textures": [{"sampler": 0, "source": 0}],
        "images": [{"bufferView": 4, "mimeType": "image/jpeg"}],
        "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497}],
        "meshes": [
            {
                "name": "RomanCoinMesh",
                "primitives": [
                    {
                        "attributes": {
                            "POSITION": 1,
                            "NORMAL": 2,
                            "TEXCOORD_0": 3
                        },
                        "indices": 0,
                        "material": 0,
                        "mode": 4
                    }
                ]
            }
        ],
        "buffers": [{"byteLength": len(total_bin)}],
        "bufferViews": [
            {"buffer": 0, "byteOffset": idx_offset, "byteLength": len(idx_bin), "target": 34963},
            {"buffer": 0, "byteOffset": pos_offset, "byteLength": len(pos_bin), "target": 34962},
            {"buffer": 0, "byteOffset": norm_offset, "byteLength": len(norm_bin), "target": 34962},
            {"buffer": 0, "byteOffset": uv_offset, "byteLength": len(uv_bin), "target": 34962},
            {"buffer": 0, "byteOffset": tex_offset, "byteLength": len(tex_bytes)}
        ],
        "accessors": [
            {"bufferView": 0, "componentType": 5123, "count": len(indices), "type": "SCALAR"},
            {"bufferView": 1, "componentType": 5126, "count": num_vertices, "type": "VEC3", "max": [max_x, max_y, max_z], "min": [min_x, min_y, min_z]},
            {"bufferView": 2, "componentType": 5126, "count": num_vertices, "type": "VEC3"},
            {"bufferView": 3, "componentType": 5126, "count": num_vertices, "type": "VEC2"}
        ]
    }

    json_str = json.dumps(gltf_dict)
    json_bytes = json_str.encode('utf-8')
    json_padded = pad4(json_bytes)

    total_glb_len = 12 + 8 + len(json_padded) + 8 + len(total_bin)
    glb_header = struct.pack('<4sII', b'glTF', 2, total_glb_len)
    json_chunk_hdr = struct.pack('<II', len(json_padded), 0x4E4F534A)
    bin_chunk_hdr = struct.pack('<II', len(total_bin), 0x004E4942)

    with open(out_glb_path, 'wb') as f:
        f.write(glb_header)
        f.write(json_chunk_hdr)
        f.write(json_padded)
        f.write(bin_chunk_hdr)
        f.write(total_bin)

    print(f'Successfully rebuilt authentic unmirrored Roman Coin GLB: {out_glb_path}')
    print(f'Dimensions: X [{min_x:.3f}, {max_x:.3f}], Y [{min_y:.3f}, {max_y:.3f}], Z [{min_z:.3f}, {max_z:.3f}]')
    print(f'Diameter: {max_x - min_x:.3f}, Thickness: {max_z - min_z:.4f}')

if __name__ == '__main__':
    build_coin_glb()
