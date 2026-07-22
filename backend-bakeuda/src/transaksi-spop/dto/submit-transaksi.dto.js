"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitTransaksiDto = exports.LampiranInputDto = exports.DetailTujuanInputDto = exports.DetailAsalInputDto = exports.CalonSubjekDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var client_1 = require("@prisma/client");
var CalonSubjekDto = function () {
    var _a;
    var _nik_decorators;
    var _nik_initializers = [];
    var _nik_extraInitializers = [];
    var _nama_subjek_decorators;
    var _nama_subjek_initializers = [];
    var _nama_subjek_extraInitializers = [];
    var _status_wp_decorators;
    var _status_wp_initializers = [];
    var _status_wp_extraInitializers = [];
    var _pekerjaan_decorators;
    var _pekerjaan_initializers = [];
    var _pekerjaan_extraInitializers = [];
    var _npwp_decorators;
    var _npwp_initializers = [];
    var _npwp_extraInitializers = [];
    var _no_hp_decorators;
    var _no_hp_initializers = [];
    var _no_hp_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _alamat_jalan_decorators;
    var _alamat_jalan_initializers = [];
    var _alamat_jalan_extraInitializers = [];
    var _blok_kav_no_subjek_decorators;
    var _blok_kav_no_subjek_initializers = [];
    var _blok_kav_no_subjek_extraInitializers = [];
    var _rt_decorators;
    var _rt_initializers = [];
    var _rt_extraInitializers = [];
    var _rw_decorators;
    var _rw_initializers = [];
    var _rw_extraInitializers = [];
    var _kelurahan_decorators;
    var _kelurahan_initializers = [];
    var _kelurahan_extraInitializers = [];
    var _kecamatan_decorators;
    var _kecamatan_initializers = [];
    var _kecamatan_extraInitializers = [];
    var _kabupaten_decorators;
    var _kabupaten_initializers = [];
    var _kabupaten_extraInitializers = [];
    var _kode_wilayah_decorators;
    var _kode_wilayah_initializers = [];
    var _kode_wilayah_extraInitializers = [];
    var _kode_pos_decorators;
    var _kode_pos_initializers = [];
    var _kode_pos_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CalonSubjekDto() {
                this.nik = __runInitializers(this, _nik_initializers, void 0);
                this.nama_subjek = (__runInitializers(this, _nik_extraInitializers), __runInitializers(this, _nama_subjek_initializers, void 0));
                this.status_wp = (__runInitializers(this, _nama_subjek_extraInitializers), __runInitializers(this, _status_wp_initializers, void 0));
                this.pekerjaan = (__runInitializers(this, _status_wp_extraInitializers), __runInitializers(this, _pekerjaan_initializers, void 0));
                this.npwp = (__runInitializers(this, _pekerjaan_extraInitializers), __runInitializers(this, _npwp_initializers, void 0));
                this.no_hp = (__runInitializers(this, _npwp_extraInitializers), __runInitializers(this, _no_hp_initializers, void 0));
                this.email = (__runInitializers(this, _no_hp_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.alamat_jalan = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _alamat_jalan_initializers, void 0));
                this.blok_kav_no_subjek = (__runInitializers(this, _alamat_jalan_extraInitializers), __runInitializers(this, _blok_kav_no_subjek_initializers, void 0));
                this.rt = (__runInitializers(this, _blok_kav_no_subjek_extraInitializers), __runInitializers(this, _rt_initializers, void 0));
                this.rw = (__runInitializers(this, _rt_extraInitializers), __runInitializers(this, _rw_initializers, void 0));
                this.kelurahan = (__runInitializers(this, _rw_extraInitializers), __runInitializers(this, _kelurahan_initializers, void 0));
                this.kecamatan = (__runInitializers(this, _kelurahan_extraInitializers), __runInitializers(this, _kecamatan_initializers, void 0));
                this.kabupaten = (__runInitializers(this, _kecamatan_extraInitializers), __runInitializers(this, _kabupaten_initializers, void 0));
                this.kode_wilayah = (__runInitializers(this, _kabupaten_extraInitializers), __runInitializers(this, _kode_wilayah_initializers, void 0));
                this.kode_pos = (__runInitializers(this, _kode_wilayah_extraInitializers), __runInitializers(this, _kode_pos_initializers, void 0));
                __runInitializers(this, _kode_pos_extraInitializers);
            }
            return CalonSubjekDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nik_decorators = [(0, class_validator_1.IsString)()];
            _nama_subjek_decorators = [(0, class_validator_1.IsString)()];
            _status_wp_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.StatusWp)];
            _pekerjaan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.Pekerjaan)];
            _npwp_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _no_hp_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _alamat_jalan_decorators = [(0, class_validator_1.IsString)()];
            _blok_kav_no_subjek_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rt_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rw_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kelurahan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kecamatan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kabupaten_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kode_wilayah_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kode_pos_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _nik_decorators, { kind: "field", name: "nik", static: false, private: false, access: { has: function (obj) { return "nik" in obj; }, get: function (obj) { return obj.nik; }, set: function (obj, value) { obj.nik = value; } }, metadata: _metadata }, _nik_initializers, _nik_extraInitializers);
            __esDecorate(null, null, _nama_subjek_decorators, { kind: "field", name: "nama_subjek", static: false, private: false, access: { has: function (obj) { return "nama_subjek" in obj; }, get: function (obj) { return obj.nama_subjek; }, set: function (obj, value) { obj.nama_subjek = value; } }, metadata: _metadata }, _nama_subjek_initializers, _nama_subjek_extraInitializers);
            __esDecorate(null, null, _status_wp_decorators, { kind: "field", name: "status_wp", static: false, private: false, access: { has: function (obj) { return "status_wp" in obj; }, get: function (obj) { return obj.status_wp; }, set: function (obj, value) { obj.status_wp = value; } }, metadata: _metadata }, _status_wp_initializers, _status_wp_extraInitializers);
            __esDecorate(null, null, _pekerjaan_decorators, { kind: "field", name: "pekerjaan", static: false, private: false, access: { has: function (obj) { return "pekerjaan" in obj; }, get: function (obj) { return obj.pekerjaan; }, set: function (obj, value) { obj.pekerjaan = value; } }, metadata: _metadata }, _pekerjaan_initializers, _pekerjaan_extraInitializers);
            __esDecorate(null, null, _npwp_decorators, { kind: "field", name: "npwp", static: false, private: false, access: { has: function (obj) { return "npwp" in obj; }, get: function (obj) { return obj.npwp; }, set: function (obj, value) { obj.npwp = value; } }, metadata: _metadata }, _npwp_initializers, _npwp_extraInitializers);
            __esDecorate(null, null, _no_hp_decorators, { kind: "field", name: "no_hp", static: false, private: false, access: { has: function (obj) { return "no_hp" in obj; }, get: function (obj) { return obj.no_hp; }, set: function (obj, value) { obj.no_hp = value; } }, metadata: _metadata }, _no_hp_initializers, _no_hp_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _alamat_jalan_decorators, { kind: "field", name: "alamat_jalan", static: false, private: false, access: { has: function (obj) { return "alamat_jalan" in obj; }, get: function (obj) { return obj.alamat_jalan; }, set: function (obj, value) { obj.alamat_jalan = value; } }, metadata: _metadata }, _alamat_jalan_initializers, _alamat_jalan_extraInitializers);
            __esDecorate(null, null, _blok_kav_no_subjek_decorators, { kind: "field", name: "blok_kav_no_subjek", static: false, private: false, access: { has: function (obj) { return "blok_kav_no_subjek" in obj; }, get: function (obj) { return obj.blok_kav_no_subjek; }, set: function (obj, value) { obj.blok_kav_no_subjek = value; } }, metadata: _metadata }, _blok_kav_no_subjek_initializers, _blok_kav_no_subjek_extraInitializers);
            __esDecorate(null, null, _rt_decorators, { kind: "field", name: "rt", static: false, private: false, access: { has: function (obj) { return "rt" in obj; }, get: function (obj) { return obj.rt; }, set: function (obj, value) { obj.rt = value; } }, metadata: _metadata }, _rt_initializers, _rt_extraInitializers);
            __esDecorate(null, null, _rw_decorators, { kind: "field", name: "rw", static: false, private: false, access: { has: function (obj) { return "rw" in obj; }, get: function (obj) { return obj.rw; }, set: function (obj, value) { obj.rw = value; } }, metadata: _metadata }, _rw_initializers, _rw_extraInitializers);
            __esDecorate(null, null, _kelurahan_decorators, { kind: "field", name: "kelurahan", static: false, private: false, access: { has: function (obj) { return "kelurahan" in obj; }, get: function (obj) { return obj.kelurahan; }, set: function (obj, value) { obj.kelurahan = value; } }, metadata: _metadata }, _kelurahan_initializers, _kelurahan_extraInitializers);
            __esDecorate(null, null, _kecamatan_decorators, { kind: "field", name: "kecamatan", static: false, private: false, access: { has: function (obj) { return "kecamatan" in obj; }, get: function (obj) { return obj.kecamatan; }, set: function (obj, value) { obj.kecamatan = value; } }, metadata: _metadata }, _kecamatan_initializers, _kecamatan_extraInitializers);
            __esDecorate(null, null, _kabupaten_decorators, { kind: "field", name: "kabupaten", static: false, private: false, access: { has: function (obj) { return "kabupaten" in obj; }, get: function (obj) { return obj.kabupaten; }, set: function (obj, value) { obj.kabupaten = value; } }, metadata: _metadata }, _kabupaten_initializers, _kabupaten_extraInitializers);
            __esDecorate(null, null, _kode_wilayah_decorators, { kind: "field", name: "kode_wilayah", static: false, private: false, access: { has: function (obj) { return "kode_wilayah" in obj; }, get: function (obj) { return obj.kode_wilayah; }, set: function (obj, value) { obj.kode_wilayah = value; } }, metadata: _metadata }, _kode_wilayah_initializers, _kode_wilayah_extraInitializers);
            __esDecorate(null, null, _kode_pos_decorators, { kind: "field", name: "kode_pos", static: false, private: false, access: { has: function (obj) { return "kode_pos" in obj; }, get: function (obj) { return obj.kode_pos; }, set: function (obj, value) { obj.kode_pos = value; } }, metadata: _metadata }, _kode_pos_initializers, _kode_pos_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CalonSubjekDto = CalonSubjekDto;
var DetailAsalInputDto = function () {
    var _a;
    var _nop_asal_decorators;
    var _nop_asal_initializers = [];
    var _nop_asal_extraInitializers = [];
    var _nonaktifkan_saat_disetujui_decorators;
    var _nonaktifkan_saat_disetujui_initializers = [];
    var _nonaktifkan_saat_disetujui_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DetailAsalInputDto() {
                this.nop_asal = __runInitializers(this, _nop_asal_initializers, void 0);
                this.nonaktifkan_saat_disetujui = (__runInitializers(this, _nop_asal_extraInitializers), __runInitializers(this, _nonaktifkan_saat_disetujui_initializers, void 0));
                __runInitializers(this, _nonaktifkan_saat_disetujui_extraInitializers);
            }
            return DetailAsalInputDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nop_asal_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.Length)(18, 18)];
            _nonaktifkan_saat_disetujui_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _nop_asal_decorators, { kind: "field", name: "nop_asal", static: false, private: false, access: { has: function (obj) { return "nop_asal" in obj; }, get: function (obj) { return obj.nop_asal; }, set: function (obj, value) { obj.nop_asal = value; } }, metadata: _metadata }, _nop_asal_initializers, _nop_asal_extraInitializers);
            __esDecorate(null, null, _nonaktifkan_saat_disetujui_decorators, { kind: "field", name: "nonaktifkan_saat_disetujui", static: false, private: false, access: { has: function (obj) { return "nonaktifkan_saat_disetujui" in obj; }, get: function (obj) { return obj.nonaktifkan_saat_disetujui; }, set: function (obj, value) { obj.nonaktifkan_saat_disetujui = value; } }, metadata: _metadata }, _nonaktifkan_saat_disetujui_initializers, _nonaktifkan_saat_disetujui_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DetailAsalInputDto = DetailAsalInputDto;
var DetailTujuanInputDto = function () {
    var _a;
    var _nik_calon_subjek_decorators;
    var _nik_calon_subjek_initializers = [];
    var _nik_calon_subjek_extraInitializers = [];
    var _calon_subjek_json_decorators;
    var _calon_subjek_json_initializers = [];
    var _calon_subjek_json_extraInitializers = [];
    var _luas_tanah_baru_decorators;
    var _luas_tanah_baru_initializers = [];
    var _luas_tanah_baru_extraInitializers = [];
    var _luas_bangunan_baru_decorators;
    var _luas_bangunan_baru_initializers = [];
    var _luas_bangunan_baru_extraInitializers = [];
    var _jumlah_bangunan_baru_decorators;
    var _jumlah_bangunan_baru_initializers = [];
    var _jumlah_bangunan_baru_extraInitializers = [];
    var _jenis_tanah_baru_decorators;
    var _jenis_tanah_baru_initializers = [];
    var _jenis_tanah_baru_extraInitializers = [];
    var _jalan_op_baru_decorators;
    var _jalan_op_baru_initializers = [];
    var _jalan_op_baru_extraInitializers = [];
    var _kode_wilayah_baru_decorators;
    var _kode_wilayah_baru_initializers = [];
    var _kode_wilayah_baru_extraInitializers = [];
    var _kode_blok_baru_decorators;
    var _kode_blok_baru_initializers = [];
    var _kode_blok_baru_extraInitializers = [];
    var _no_persil_baru_decorators;
    var _no_persil_baru_initializers = [];
    var _no_persil_baru_extraInitializers = [];
    var _rt_op_baru_decorators;
    var _rt_op_baru_initializers = [];
    var _rt_op_baru_extraInitializers = [];
    var _rw_op_baru_decorators;
    var _rw_op_baru_initializers = [];
    var _rw_op_baru_extraInitializers = [];
    var _blok_kav_no_baru_decorators;
    var _blok_kav_no_baru_initializers = [];
    var _blok_kav_no_baru_extraInitializers = [];
    var _kelurahan_op_baru_decorators;
    var _kelurahan_op_baru_initializers = [];
    var _kelurahan_op_baru_extraInitializers = [];
    var _kecamatan_op_baru_decorators;
    var _kecamatan_op_baru_initializers = [];
    var _kecamatan_op_baru_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _koordinat_polygon_decorators;
    var _koordinat_polygon_initializers = [];
    var _koordinat_polygon_extraInitializers = [];
    var _batas_utara_decorators;
    var _batas_utara_initializers = [];
    var _batas_utara_extraInitializers = [];
    var _batas_selatan_decorators;
    var _batas_selatan_initializers = [];
    var _batas_selatan_extraInitializers = [];
    var _batas_timur_decorators;
    var _batas_timur_initializers = [];
    var _batas_timur_extraInitializers = [];
    var _batas_barat_decorators;
    var _batas_barat_initializers = [];
    var _batas_barat_extraInitializers = [];
    var _data_bangunan_json_decorators;
    var _data_bangunan_json_initializers = [];
    var _data_bangunan_json_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DetailTujuanInputDto() {
                this.nik_calon_subjek = __runInitializers(this, _nik_calon_subjek_initializers, void 0);
                this.calon_subjek_json = (__runInitializers(this, _nik_calon_subjek_extraInitializers), __runInitializers(this, _calon_subjek_json_initializers, void 0));
                this.luas_tanah_baru = (__runInitializers(this, _calon_subjek_json_extraInitializers), __runInitializers(this, _luas_tanah_baru_initializers, void 0));
                this.luas_bangunan_baru = (__runInitializers(this, _luas_tanah_baru_extraInitializers), __runInitializers(this, _luas_bangunan_baru_initializers, void 0));
                this.jumlah_bangunan_baru = (__runInitializers(this, _luas_bangunan_baru_extraInitializers), __runInitializers(this, _jumlah_bangunan_baru_initializers, void 0));
                this.jenis_tanah_baru = (__runInitializers(this, _jumlah_bangunan_baru_extraInitializers), __runInitializers(this, _jenis_tanah_baru_initializers, void 0));
                this.jalan_op_baru = (__runInitializers(this, _jenis_tanah_baru_extraInitializers), __runInitializers(this, _jalan_op_baru_initializers, void 0));
                this.kode_wilayah_baru = (__runInitializers(this, _jalan_op_baru_extraInitializers), __runInitializers(this, _kode_wilayah_baru_initializers, void 0));
                this.kode_blok_baru = (__runInitializers(this, _kode_wilayah_baru_extraInitializers), __runInitializers(this, _kode_blok_baru_initializers, void 0));
                this.no_persil_baru = (__runInitializers(this, _kode_blok_baru_extraInitializers), __runInitializers(this, _no_persil_baru_initializers, void 0));
                this.rt_op_baru = (__runInitializers(this, _no_persil_baru_extraInitializers), __runInitializers(this, _rt_op_baru_initializers, void 0));
                this.rw_op_baru = (__runInitializers(this, _rt_op_baru_extraInitializers), __runInitializers(this, _rw_op_baru_initializers, void 0));
                this.blok_kav_no_baru = (__runInitializers(this, _rw_op_baru_extraInitializers), __runInitializers(this, _blok_kav_no_baru_initializers, void 0));
                this.kelurahan_op_baru = (__runInitializers(this, _blok_kav_no_baru_extraInitializers), __runInitializers(this, _kelurahan_op_baru_initializers, void 0));
                this.kecamatan_op_baru = (__runInitializers(this, _kelurahan_op_baru_extraInitializers), __runInitializers(this, _kecamatan_op_baru_initializers, void 0));
                this.latitude = (__runInitializers(this, _kecamatan_op_baru_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.koordinat_polygon = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _koordinat_polygon_initializers, void 0));
                this.batas_utara = (__runInitializers(this, _koordinat_polygon_extraInitializers), __runInitializers(this, _batas_utara_initializers, void 0));
                this.batas_selatan = (__runInitializers(this, _batas_utara_extraInitializers), __runInitializers(this, _batas_selatan_initializers, void 0));
                this.batas_timur = (__runInitializers(this, _batas_selatan_extraInitializers), __runInitializers(this, _batas_timur_initializers, void 0));
                this.batas_barat = (__runInitializers(this, _batas_timur_extraInitializers), __runInitializers(this, _batas_barat_initializers, void 0));
                this.data_bangunan_json = (__runInitializers(this, _batas_barat_extraInitializers), __runInitializers(this, _data_bangunan_json_initializers, void 0));
                __runInitializers(this, _data_bangunan_json_extraInitializers);
            }
            return DetailTujuanInputDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nik_calon_subjek_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _calon_subjek_json_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.ValidateNested)(), (0, class_transformer_1.Type)(function () { return CalonSubjekDto; })];
            _luas_tanah_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _luas_bangunan_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _jumlah_bangunan_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _jenis_tanah_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.JenisTanah)];
            _jalan_op_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kode_wilayah_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kode_blok_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _no_persil_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rt_op_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _rw_op_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _blok_kav_no_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kelurahan_op_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _kecamatan_op_baru_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _latitude_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _longitude_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _koordinat_polygon_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _batas_utara_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _batas_selatan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _batas_timur_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _batas_barat_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _data_bangunan_json_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _nik_calon_subjek_decorators, { kind: "field", name: "nik_calon_subjek", static: false, private: false, access: { has: function (obj) { return "nik_calon_subjek" in obj; }, get: function (obj) { return obj.nik_calon_subjek; }, set: function (obj, value) { obj.nik_calon_subjek = value; } }, metadata: _metadata }, _nik_calon_subjek_initializers, _nik_calon_subjek_extraInitializers);
            __esDecorate(null, null, _calon_subjek_json_decorators, { kind: "field", name: "calon_subjek_json", static: false, private: false, access: { has: function (obj) { return "calon_subjek_json" in obj; }, get: function (obj) { return obj.calon_subjek_json; }, set: function (obj, value) { obj.calon_subjek_json = value; } }, metadata: _metadata }, _calon_subjek_json_initializers, _calon_subjek_json_extraInitializers);
            __esDecorate(null, null, _luas_tanah_baru_decorators, { kind: "field", name: "luas_tanah_baru", static: false, private: false, access: { has: function (obj) { return "luas_tanah_baru" in obj; }, get: function (obj) { return obj.luas_tanah_baru; }, set: function (obj, value) { obj.luas_tanah_baru = value; } }, metadata: _metadata }, _luas_tanah_baru_initializers, _luas_tanah_baru_extraInitializers);
            __esDecorate(null, null, _luas_bangunan_baru_decorators, { kind: "field", name: "luas_bangunan_baru", static: false, private: false, access: { has: function (obj) { return "luas_bangunan_baru" in obj; }, get: function (obj) { return obj.luas_bangunan_baru; }, set: function (obj, value) { obj.luas_bangunan_baru = value; } }, metadata: _metadata }, _luas_bangunan_baru_initializers, _luas_bangunan_baru_extraInitializers);
            __esDecorate(null, null, _jumlah_bangunan_baru_decorators, { kind: "field", name: "jumlah_bangunan_baru", static: false, private: false, access: { has: function (obj) { return "jumlah_bangunan_baru" in obj; }, get: function (obj) { return obj.jumlah_bangunan_baru; }, set: function (obj, value) { obj.jumlah_bangunan_baru = value; } }, metadata: _metadata }, _jumlah_bangunan_baru_initializers, _jumlah_bangunan_baru_extraInitializers);
            __esDecorate(null, null, _jenis_tanah_baru_decorators, { kind: "field", name: "jenis_tanah_baru", static: false, private: false, access: { has: function (obj) { return "jenis_tanah_baru" in obj; }, get: function (obj) { return obj.jenis_tanah_baru; }, set: function (obj, value) { obj.jenis_tanah_baru = value; } }, metadata: _metadata }, _jenis_tanah_baru_initializers, _jenis_tanah_baru_extraInitializers);
            __esDecorate(null, null, _jalan_op_baru_decorators, { kind: "field", name: "jalan_op_baru", static: false, private: false, access: { has: function (obj) { return "jalan_op_baru" in obj; }, get: function (obj) { return obj.jalan_op_baru; }, set: function (obj, value) { obj.jalan_op_baru = value; } }, metadata: _metadata }, _jalan_op_baru_initializers, _jalan_op_baru_extraInitializers);
            __esDecorate(null, null, _kode_wilayah_baru_decorators, { kind: "field", name: "kode_wilayah_baru", static: false, private: false, access: { has: function (obj) { return "kode_wilayah_baru" in obj; }, get: function (obj) { return obj.kode_wilayah_baru; }, set: function (obj, value) { obj.kode_wilayah_baru = value; } }, metadata: _metadata }, _kode_wilayah_baru_initializers, _kode_wilayah_baru_extraInitializers);
            __esDecorate(null, null, _kode_blok_baru_decorators, { kind: "field", name: "kode_blok_baru", static: false, private: false, access: { has: function (obj) { return "kode_blok_baru" in obj; }, get: function (obj) { return obj.kode_blok_baru; }, set: function (obj, value) { obj.kode_blok_baru = value; } }, metadata: _metadata }, _kode_blok_baru_initializers, _kode_blok_baru_extraInitializers);
            __esDecorate(null, null, _no_persil_baru_decorators, { kind: "field", name: "no_persil_baru", static: false, private: false, access: { has: function (obj) { return "no_persil_baru" in obj; }, get: function (obj) { return obj.no_persil_baru; }, set: function (obj, value) { obj.no_persil_baru = value; } }, metadata: _metadata }, _no_persil_baru_initializers, _no_persil_baru_extraInitializers);
            __esDecorate(null, null, _rt_op_baru_decorators, { kind: "field", name: "rt_op_baru", static: false, private: false, access: { has: function (obj) { return "rt_op_baru" in obj; }, get: function (obj) { return obj.rt_op_baru; }, set: function (obj, value) { obj.rt_op_baru = value; } }, metadata: _metadata }, _rt_op_baru_initializers, _rt_op_baru_extraInitializers);
            __esDecorate(null, null, _rw_op_baru_decorators, { kind: "field", name: "rw_op_baru", static: false, private: false, access: { has: function (obj) { return "rw_op_baru" in obj; }, get: function (obj) { return obj.rw_op_baru; }, set: function (obj, value) { obj.rw_op_baru = value; } }, metadata: _metadata }, _rw_op_baru_initializers, _rw_op_baru_extraInitializers);
            __esDecorate(null, null, _blok_kav_no_baru_decorators, { kind: "field", name: "blok_kav_no_baru", static: false, private: false, access: { has: function (obj) { return "blok_kav_no_baru" in obj; }, get: function (obj) { return obj.blok_kav_no_baru; }, set: function (obj, value) { obj.blok_kav_no_baru = value; } }, metadata: _metadata }, _blok_kav_no_baru_initializers, _blok_kav_no_baru_extraInitializers);
            __esDecorate(null, null, _kelurahan_op_baru_decorators, { kind: "field", name: "kelurahan_op_baru", static: false, private: false, access: { has: function (obj) { return "kelurahan_op_baru" in obj; }, get: function (obj) { return obj.kelurahan_op_baru; }, set: function (obj, value) { obj.kelurahan_op_baru = value; } }, metadata: _metadata }, _kelurahan_op_baru_initializers, _kelurahan_op_baru_extraInitializers);
            __esDecorate(null, null, _kecamatan_op_baru_decorators, { kind: "field", name: "kecamatan_op_baru", static: false, private: false, access: { has: function (obj) { return "kecamatan_op_baru" in obj; }, get: function (obj) { return obj.kecamatan_op_baru; }, set: function (obj, value) { obj.kecamatan_op_baru = value; } }, metadata: _metadata }, _kecamatan_op_baru_initializers, _kecamatan_op_baru_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _koordinat_polygon_decorators, { kind: "field", name: "koordinat_polygon", static: false, private: false, access: { has: function (obj) { return "koordinat_polygon" in obj; }, get: function (obj) { return obj.koordinat_polygon; }, set: function (obj, value) { obj.koordinat_polygon = value; } }, metadata: _metadata }, _koordinat_polygon_initializers, _koordinat_polygon_extraInitializers);
            __esDecorate(null, null, _batas_utara_decorators, { kind: "field", name: "batas_utara", static: false, private: false, access: { has: function (obj) { return "batas_utara" in obj; }, get: function (obj) { return obj.batas_utara; }, set: function (obj, value) { obj.batas_utara = value; } }, metadata: _metadata }, _batas_utara_initializers, _batas_utara_extraInitializers);
            __esDecorate(null, null, _batas_selatan_decorators, { kind: "field", name: "batas_selatan", static: false, private: false, access: { has: function (obj) { return "batas_selatan" in obj; }, get: function (obj) { return obj.batas_selatan; }, set: function (obj, value) { obj.batas_selatan = value; } }, metadata: _metadata }, _batas_selatan_initializers, _batas_selatan_extraInitializers);
            __esDecorate(null, null, _batas_timur_decorators, { kind: "field", name: "batas_timur", static: false, private: false, access: { has: function (obj) { return "batas_timur" in obj; }, get: function (obj) { return obj.batas_timur; }, set: function (obj, value) { obj.batas_timur = value; } }, metadata: _metadata }, _batas_timur_initializers, _batas_timur_extraInitializers);
            __esDecorate(null, null, _batas_barat_decorators, { kind: "field", name: "batas_barat", static: false, private: false, access: { has: function (obj) { return "batas_barat" in obj; }, get: function (obj) { return obj.batas_barat; }, set: function (obj, value) { obj.batas_barat = value; } }, metadata: _metadata }, _batas_barat_initializers, _batas_barat_extraInitializers);
            __esDecorate(null, null, _data_bangunan_json_decorators, { kind: "field", name: "data_bangunan_json", static: false, private: false, access: { has: function (obj) { return "data_bangunan_json" in obj; }, get: function (obj) { return obj.data_bangunan_json; }, set: function (obj, value) { obj.data_bangunan_json = value; } }, metadata: _metadata }, _data_bangunan_json_initializers, _data_bangunan_json_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DetailTujuanInputDto = DetailTujuanInputDto;
var LampiranInputDto = function () {
    var _a;
    var _jenis_dokumen_decorators;
    var _jenis_dokumen_initializers = [];
    var _jenis_dokumen_extraInitializers = [];
    var _url_file_decorators;
    var _url_file_initializers = [];
    var _url_file_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LampiranInputDto() {
                this.jenis_dokumen = __runInitializers(this, _jenis_dokumen_initializers, void 0);
                this.url_file = (__runInitializers(this, _jenis_dokumen_extraInitializers), __runInitializers(this, _url_file_initializers, void 0));
                __runInitializers(this, _url_file_extraInitializers);
            }
            return LampiranInputDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jenis_dokumen_decorators = [(0, class_validator_1.IsString)()];
            _url_file_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _jenis_dokumen_decorators, { kind: "field", name: "jenis_dokumen", static: false, private: false, access: { has: function (obj) { return "jenis_dokumen" in obj; }, get: function (obj) { return obj.jenis_dokumen; }, set: function (obj, value) { obj.jenis_dokumen = value; } }, metadata: _metadata }, _jenis_dokumen_initializers, _jenis_dokumen_extraInitializers);
            __esDecorate(null, null, _url_file_decorators, { kind: "field", name: "url_file", static: false, private: false, access: { has: function (obj) { return "url_file" in obj; }, get: function (obj) { return obj.url_file; }, set: function (obj, value) { obj.url_file = value; } }, metadata: _metadata }, _url_file_initializers, _url_file_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LampiranInputDto = LampiranInputDto;
var SubmitTransaksiDto = function () {
    var _a;
    var _jenis_transaksi_decorators;
    var _jenis_transaksi_initializers = [];
    var _jenis_transaksi_extraInitializers = [];
    var _no_formulir_decorators;
    var _no_formulir_initializers = [];
    var _no_formulir_extraInitializers = [];
    var _catatan_pengaju_decorators;
    var _catatan_pengaju_initializers = [];
    var _catatan_pengaju_extraInitializers = [];
    var _tahun_pajak_decorators;
    var _tahun_pajak_initializers = [];
    var _tahun_pajak_extraInitializers = [];
    var _no_sppt_lama_decorators;
    var _no_sppt_lama_initializers = [];
    var _no_sppt_lama_extraInitializers = [];
    var _nama_pengaju_decorators;
    var _nama_pengaju_initializers = [];
    var _nama_pengaju_extraInitializers = [];
    var _menggunakan_kuasa_decorators;
    var _menggunakan_kuasa_initializers = [];
    var _menggunakan_kuasa_extraInitializers = [];
    var _tanggal_pengajuan_decorators;
    var _tanggal_pengajuan_initializers = [];
    var _tanggal_pengajuan_extraInitializers = [];
    var _nop_bersama_decorators;
    var _nop_bersama_initializers = [];
    var _nop_bersama_extraInitializers = [];
    var _detail_asal_decorators;
    var _detail_asal_initializers = [];
    var _detail_asal_extraInitializers = [];
    var _detail_tujuan_decorators;
    var _detail_tujuan_initializers = [];
    var _detail_tujuan_extraInitializers = [];
    var _lampiran_decorators;
    var _lampiran_initializers = [];
    var _lampiran_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitTransaksiDto() {
                this.jenis_transaksi = __runInitializers(this, _jenis_transaksi_initializers, void 0);
                this.no_formulir = (__runInitializers(this, _jenis_transaksi_extraInitializers), __runInitializers(this, _no_formulir_initializers, void 0));
                this.catatan_pengaju = (__runInitializers(this, _no_formulir_extraInitializers), __runInitializers(this, _catatan_pengaju_initializers, void 0));
                this.tahun_pajak = (__runInitializers(this, _catatan_pengaju_extraInitializers), __runInitializers(this, _tahun_pajak_initializers, void 0));
                this.no_sppt_lama = (__runInitializers(this, _tahun_pajak_extraInitializers), __runInitializers(this, _no_sppt_lama_initializers, void 0));
                this.nama_pengaju = (__runInitializers(this, _no_sppt_lama_extraInitializers), __runInitializers(this, _nama_pengaju_initializers, void 0));
                this.menggunakan_kuasa = (__runInitializers(this, _nama_pengaju_extraInitializers), __runInitializers(this, _menggunakan_kuasa_initializers, void 0));
                this.tanggal_pengajuan = (__runInitializers(this, _menggunakan_kuasa_extraInitializers), __runInitializers(this, _tanggal_pengajuan_initializers, void 0));
                this.nop_bersama = (__runInitializers(this, _tanggal_pengajuan_extraInitializers), __runInitializers(this, _nop_bersama_initializers, void 0));
                this.detail_asal = (__runInitializers(this, _nop_bersama_extraInitializers), __runInitializers(this, _detail_asal_initializers, void 0));
                this.detail_tujuan = (__runInitializers(this, _detail_asal_extraInitializers), __runInitializers(this, _detail_tujuan_initializers, void 0));
                this.lampiran = (__runInitializers(this, _detail_tujuan_extraInitializers), __runInitializers(this, _lampiran_initializers, void 0));
                __runInitializers(this, _lampiran_extraInitializers);
            }
            return SubmitTransaksiDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _jenis_transaksi_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.JenisTransaksi)];
            _no_formulir_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _catatan_pengaju_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tahun_pajak_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _no_sppt_lama_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _nama_pengaju_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _menggunakan_kuasa_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _tanggal_pengajuan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _nop_bersama_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _detail_asal_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return DetailAsalInputDto; })];
            _detail_tujuan_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return DetailTujuanInputDto; })];
            _lampiran_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return LampiranInputDto; })];
            __esDecorate(null, null, _jenis_transaksi_decorators, { kind: "field", name: "jenis_transaksi", static: false, private: false, access: { has: function (obj) { return "jenis_transaksi" in obj; }, get: function (obj) { return obj.jenis_transaksi; }, set: function (obj, value) { obj.jenis_transaksi = value; } }, metadata: _metadata }, _jenis_transaksi_initializers, _jenis_transaksi_extraInitializers);
            __esDecorate(null, null, _no_formulir_decorators, { kind: "field", name: "no_formulir", static: false, private: false, access: { has: function (obj) { return "no_formulir" in obj; }, get: function (obj) { return obj.no_formulir; }, set: function (obj, value) { obj.no_formulir = value; } }, metadata: _metadata }, _no_formulir_initializers, _no_formulir_extraInitializers);
            __esDecorate(null, null, _catatan_pengaju_decorators, { kind: "field", name: "catatan_pengaju", static: false, private: false, access: { has: function (obj) { return "catatan_pengaju" in obj; }, get: function (obj) { return obj.catatan_pengaju; }, set: function (obj, value) { obj.catatan_pengaju = value; } }, metadata: _metadata }, _catatan_pengaju_initializers, _catatan_pengaju_extraInitializers);
            __esDecorate(null, null, _tahun_pajak_decorators, { kind: "field", name: "tahun_pajak", static: false, private: false, access: { has: function (obj) { return "tahun_pajak" in obj; }, get: function (obj) { return obj.tahun_pajak; }, set: function (obj, value) { obj.tahun_pajak = value; } }, metadata: _metadata }, _tahun_pajak_initializers, _tahun_pajak_extraInitializers);
            __esDecorate(null, null, _no_sppt_lama_decorators, { kind: "field", name: "no_sppt_lama", static: false, private: false, access: { has: function (obj) { return "no_sppt_lama" in obj; }, get: function (obj) { return obj.no_sppt_lama; }, set: function (obj, value) { obj.no_sppt_lama = value; } }, metadata: _metadata }, _no_sppt_lama_initializers, _no_sppt_lama_extraInitializers);
            __esDecorate(null, null, _nama_pengaju_decorators, { kind: "field", name: "nama_pengaju", static: false, private: false, access: { has: function (obj) { return "nama_pengaju" in obj; }, get: function (obj) { return obj.nama_pengaju; }, set: function (obj, value) { obj.nama_pengaju = value; } }, metadata: _metadata }, _nama_pengaju_initializers, _nama_pengaju_extraInitializers);
            __esDecorate(null, null, _menggunakan_kuasa_decorators, { kind: "field", name: "menggunakan_kuasa", static: false, private: false, access: { has: function (obj) { return "menggunakan_kuasa" in obj; }, get: function (obj) { return obj.menggunakan_kuasa; }, set: function (obj, value) { obj.menggunakan_kuasa = value; } }, metadata: _metadata }, _menggunakan_kuasa_initializers, _menggunakan_kuasa_extraInitializers);
            __esDecorate(null, null, _tanggal_pengajuan_decorators, { kind: "field", name: "tanggal_pengajuan", static: false, private: false, access: { has: function (obj) { return "tanggal_pengajuan" in obj; }, get: function (obj) { return obj.tanggal_pengajuan; }, set: function (obj, value) { obj.tanggal_pengajuan = value; } }, metadata: _metadata }, _tanggal_pengajuan_initializers, _tanggal_pengajuan_extraInitializers);
            __esDecorate(null, null, _nop_bersama_decorators, { kind: "field", name: "nop_bersama", static: false, private: false, access: { has: function (obj) { return "nop_bersama" in obj; }, get: function (obj) { return obj.nop_bersama; }, set: function (obj, value) { obj.nop_bersama = value; } }, metadata: _metadata }, _nop_bersama_initializers, _nop_bersama_extraInitializers);
            __esDecorate(null, null, _detail_asal_decorators, { kind: "field", name: "detail_asal", static: false, private: false, access: { has: function (obj) { return "detail_asal" in obj; }, get: function (obj) { return obj.detail_asal; }, set: function (obj, value) { obj.detail_asal = value; } }, metadata: _metadata }, _detail_asal_initializers, _detail_asal_extraInitializers);
            __esDecorate(null, null, _detail_tujuan_decorators, { kind: "field", name: "detail_tujuan", static: false, private: false, access: { has: function (obj) { return "detail_tujuan" in obj; }, get: function (obj) { return obj.detail_tujuan; }, set: function (obj, value) { obj.detail_tujuan = value; } }, metadata: _metadata }, _detail_tujuan_initializers, _detail_tujuan_extraInitializers);
            __esDecorate(null, null, _lampiran_decorators, { kind: "field", name: "lampiran", static: false, private: false, access: { has: function (obj) { return "lampiran" in obj; }, get: function (obj) { return obj.lampiran; }, set: function (obj, value) { obj.lampiran = value; } }, metadata: _metadata }, _lampiran_initializers, _lampiran_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitTransaksiDto = SubmitTransaksiDto;
