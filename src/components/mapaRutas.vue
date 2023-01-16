<template>
    <div>
        <h2>Distribución de rutas sector "{{zonaAct}}"</h2>
        <l-map style="height: 600px" :zoom="zoom" :center="center" id="map" >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
            <l-routing-machine :waypoints="waypoints" v-if="actualizado == 1"/>
        </l-map>
        <b-row>
            <b-col cols="12" md="4">
                <b-button @click="Volver()" class="boton">Volver</b-button>
            </b-col>
            <b-col cols="12" md="4">
                <select class="form-select" v-model="camion" aria-label="Default select example">
                    <option v-for="i in NRutas" :key="i.numero" :value="i.numero">{{i.texto}}</option>
                </select>
            </b-col>
            <b-col cols="12" md="4">
                <b-button @click="mostrarRuta()" class="btn-warning boton" v-if="actualizado == 0">Mostrar Ruta</b-button>
                <b-button @click="mostrarRuta()" class="btn-danger boton" v-if="actualizado == 1">Quitar Ruta</b-button>
            </b-col>
        </b-row>
        <br>
        <b-row>
            <b-col cols="12" md="6">
                <b-button @click="defecto()" variant="primary" class="boton">Mostrar el recorrido obtenido por defecto</b-button>
            </b-col>
            <b-col cols="12" md="6">
                <b-button @click="guardar()" class="btn-success boton">Guardar cambios de la ruta actual</b-button>
            </b-col>
        </b-row>
        <br>
        <div class="card" style="border-color: black;">
            <div class="card-header"><br>
                <h1 class="card-title mb-4">Direcciones del recorrido</h1>
            </div>
            <div class="card-body"><br>
                <b-row class="mb-3" v-for="i in direcciones" :key="i.numero">
                    <b-col cols="12" md="3" v-if="i.direccion == 'Sucursal'" >
                        <label for="exampleInputEmail1" class="letraDireccion">{{i.direccion}}</label>
                    </b-col>
                    <b-col cols="12" md="3" v-else>
                        <label for="exampleInputEmail1" class="letraDireccion">{{i.codigo}}</label>
                    </b-col>
                    <b-col cols="12" md="4">
                        <label for="exampleInputEmail1" class="letraDemananda">{{i.demanda + " Kg"}}</label>
                    </b-col>
                    <b-col cols="12" md="3">
                        <label for="exampleInputEmail1" class="letraDireccion">{{i.tipo}}</label>
                    </b-col>
                    <b-col cols="12" md="1">
                        <img src="../assets/flecha.png" @click="Subir(i)" class="imagenArriba" alt="" width="100px"> 
                    </b-col>
                    <b-col cols="12" md="1">
                        <img src="../assets/flecha.png" @click="Bajar(i)" class="imagenAbajo" alt="" width="100px"> 
                    </b-col>
                    <br><hr v-if="i.numero != direcciones.length-1">
                </b-row>
                <div class="card-footer text-muted">
                    Total de demanda: {{totalCarga}} kg || Tiempo de Servicio en ruta: {{tiempos[camion]}} Minutos || Total de Clientes: {{total}}
                </div>
            </div>
        </div><br><br>
        <b-row>
            <b-col cols="12" md="6">
                <label for="exampleInputEmail1" class="letraDireccion">Designar ruta a transportista:</label>
                <select class="form-select" @change="cambiarTransportista()" v-model="rutaCamionero[camion]" aria-label="Default select example">
                    <option v-for="i in transportistas" :key="i.codigo">{{i.nombre}}</option>
                </select>
            </b-col>
            <b-col cols="12" md="6">
                <b-button @click="exportar()" class="btn-success boton">Exportar ruta a Excel</b-button>
            </b-col>
        </b-row><br><br>
    </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import LRoutingMachine from '../components/LRoutingMachine';
import router from '@/router';

//EXCEL eXportación
import * as XLSX from 'xlsx/xlsx.mjs';
/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);


export default{
    name: "mapaRutas",
    data(){
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:'&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 12,
            center: [-30.03681, -71.26901],
            markerLatLng: [-30.03681, -71.26901],
            waypoints: [],
            ruta: [],
            clientes: [],
            listaClientes: [],
            camion: 0,
            actualizado: 0,
            direcciones: [],
            rutaOriginal: [],
            totalCarga: 0,
            zonaAct: '',
            NRutas: [],
            transportistas: [],
            rutaCamionero: [],
            tiempos: [],
            total: 0
        }
    },
    components: {LMap, LTileLayer, LMarker, LRoutingMachine},
    created(){
        this.obtenerTransportistas();
    },
    methods: {
        obtenerTransportistas(){
            this.axios.get(`http://localhost:8000/apiTransportistas/transportista/`)
                .then(res => {
                this.transportistas = res.data;
                this.generarRuta();
                })
                .catch(e => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se ha logrado obtener a los transportistas',
                    footer: 'No se han logrado cargar a los transportistas de la base de datos'
                })
            })
        },
        generarRuta(){
            this.clientes = this.$route.query.array
            this.ruta = this.$route.query.ruta
            this.tiempos = this.$route.query.tiempos
            var rutaString =  JSON.stringify(this.ruta)
            this.rutaOriginal = JSON.parse(rutaString)
            this.contarRutas()
        },
        contarRutas(){
            for(var i = 0; i < this.ruta.length; i++){
                this.NRutas.push({numero: i, texto: 'Ruta N° ' + (i+1)})
                this.rutaCamionero.push(this.transportistas[0].nombre)
            }
        },
        recorrido(){
            this.totalCarga = 0
            this.zonaAct = this.clientes[this.ruta[this.camion][1]].zona
            this.waypoints = []
            this.direcciones = []
            this.total = 0
            for(var i = 0; i < this.ruta[this.camion].length; i++){
                this.waypoints.push({lat: this.clientes[this.ruta[this.camion][i]].latitud, lng: this.clientes[this.ruta[this.camion][i]].longitud})
                if(i == 0 || i == this.ruta[this.camion].length-1){
                    this.direcciones.push({numero: i, direccion: 'Sucursal', tipo: this.clientes[this.ruta[this.camion][i]].tipo, demanda: this.clientes[this.ruta[this.camion][i]].demanda, codigo: this.clientes[this.ruta[this.camion][i]].codigo, transportista: this.rutaCamionero[this.camion]})
                }else{
                    this.direcciones.push({numero: i, direccion: this.clientes[this.ruta[this.camion][i]].direccion, tipo: this.clientes[this.ruta[this.camion][i]].tipo, demanda: this.clientes[this.ruta[this.camion][i]].demanda, codigo: this.clientes[this.ruta[this.camion][i]].codigo, transportista: this.rutaCamionero[this.camion]})
                    this.totalCarga = this.totalCarga + this.clientes[this.ruta[this.camion][i]].demanda
                    this.total = this.total + 1
                }
            }
        },
        mostrarRuta(){
            if(this.actualizado == 1){
                this.actualizado = 0
            }else{
                this.recorrido()
                this.actualizado = 1
            }
        },
        defecto(){
            var rutaString =  JSON.stringify(this.rutaOriginal[this.camion])
            this.ruta[this.camion] = JSON.parse(rutaString)
            this.actualizado = 0
            Swal.fire(
                'Se ha regresado a la ruta por defecto, muestre la nueva ruta para ver los cambios!',
                'Seleccione Ok para continuar',
                'success'
            )
        },
        guardar(){
            for(var i = 0; i < this.direcciones.length; i++){
                const index = this.clientes.findIndex(item => item.codigo == this.direcciones[i].codigo);
                this.ruta[this.camion][i] = index
            }
            this.actualizado = 0
            Swal.fire(
                'Se ha guardado la ruta correctamente',
                'Seleccione Ok para continuar',
                'success'
            )
        },
        Subir(i){
            const index = this.direcciones.findIndex(item => item.numero == i.numero);
            if(index != 0 && index != 1 && index != this.direcciones.length-1){
                var aux = this.direcciones[index-1]
                this.direcciones[index-1] = this.direcciones[index]
                this.direcciones[index] = aux
                this.direcciones.splice(this.direcciones.length-1, 0)
            }
        },
        Bajar(i){
            const index = this.direcciones.findIndex(item => item.numero == i.numero);
            if(index != 0 && index != this.direcciones.length-2 && index != this.direcciones.length-1){
                var aux = this.direcciones[index+1]
                this.direcciones[index+1] = this.direcciones[index]
                this.direcciones[index] = aux
                this.direcciones.splice(this.direcciones.length-1, 0)
            }
        },
        Volver(){
            router.push("/")
        },
        cambiarTransportista(){
            for(var i = 0; i < this.direcciones.length; i++){
                this.direcciones[i].transportista = this.rutaCamionero[this.camion]
            }
        },
        exportar(){
            let data = [];
            var filename = "Ruta N°" + (this.camion + 1) + "_" + this.rutaCamionero[this.camion];
            var arreglado = this.direcciones.map( item => { 
                return { Código: item.codigo , Dirección : item.direccion, Demanda: item.demanda}; 
            });
            data = XLSX.utils.json_to_sheet(arreglado);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, data, filename);
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        }
    },
}
</script>

<style scoped>
    .boton{
        margin: 20px;
        width: 90%;
        border-radius: 12px;
        border-color: black;
    }

    #titulo{
        margin-top: 30px;
        margin-bottom: 10px;
    }
    #map{
        border-color: #aaaaaa;
        border-width: 1px;
        border-style: solid;
    }
    #Excel{
        margin-top: 20px;
        border-color: #aaaaaa;
        border-width: 1px;
        border-style: solid;
    }
    .form-select{
        margin-top: 20px;
    }
    .letraDireccion{
        display: flex;
        align-items: center;
        line-height: 10px;
        font-size: 20px;
    }

    .letraDemananda{
        display: flex;
        align-items: center;
        line-height: 10px;
        font-size: 22px;
    }
    .imagenArriba{
        transform:rotate(270deg);
        position: relative;
        top: -20px;
        cursor:pointer;
    }

    .imagenAbajo{
        transform:rotate(90deg);
        position: relative;
        top: -20px;
        cursor:pointer;
    }
</style>