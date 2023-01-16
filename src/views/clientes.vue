<template>
  <div class="home">
    <navbar />
    <br /><br />
    <h1 id="menu">Listado de clientes</h1>
    <b-container>
      <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="mensaje.color"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        {{mensaje.texto}}
    </b-alert>
    <div class="card" style="border-color: black;" v-if="valido == false">
      <div class="card-header"><br>
        <h2 class="card-title mb-4">Ingrese Contraseña</h2>
      </div>
      <div class="card-body">
        <b-row>
          <b-col cols="12" md="6">
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="codCliente" aria-describedby="emailHelp" v-model="contra">
            </div>
          </b-col>
          <b-col cols="12" md="6">
            <div class="mb-3">
              <b-button @click="contraseña()" variant="primary" class=" boton">Ingresar Contraseña</b-button>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
      <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="tablaCliente" v-if="valido">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Tipo</th>
            <th scope="col">Dirección</th>
            <th scope="col">Sector</th>
            <th scope="col">Días</th>
            <th scope="col">Demanda</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in clientes" :key="i.codigo">
            <td scope="row">{{i.codigo}}</td>
            <td>{{i.tipo}}</td>
            <td>{{i.direccion}}</td>
            <td>{{i.sector}}</td>
            <td>{{i.dias}}</td>
            <td><input @change="CambiaDemanda(i)" type="number" class="form-control" v-model="i.demanda" min="0"></td>
            <td>
              <b-button @click="Acteditar(i.codigo)" class="btn-warning btn-sm" style="border-color: white;">Editar</b-button>
            </td>
            <td>
              <b-button @click="quitar(i)" class="btn-danger btn-sm" style="border-color: white;">Eliminar</b-button>
            </td>
          </tr>
        </tbody>
      </table>
      <b-row v-if="valido">
        <b-col cols="12" md="6" v-if="excel == false">
          <input id="Excel" type="file" @change="subirExcel()" style="display:none" ref="file"/>
          <b-button class="btn-success boton" @click="ImportarExcel()">Importar Excel</b-button>
        </b-col>
        <b-col cols="12" md="3" v-if="excel">
          <input id="Excel" type="file" @change="subirExcel()" style="display:none" ref="file"/>
          <b-button class="btn-success boton" @click="ImportarExcel()">Importar Excel</b-button>
        </b-col>
        <b-col cols="12" md="3" v-if="excel">
          <b-button class="btn-warning boton" @click="cambiarClientes()">Cargar Datos</b-button>
        </b-col>
        <b-col cols="12" md="6">
          <b-button @click="GeneraRuta()" variant="primary" class="boton">Generar Ruta</b-button>
        </b-col>
      </b-row>
      <b-row v-if="(faltan.length != 0)">
        <p style="color:red;">{{faltan}}</p>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import navbar from "../components/navbar.vue";

import readXlsFile from "read-excel-file";

import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"
import $ from 'jquery'; 

import router from '@/router';
import { mapState } from 'vuex'
import { mapActions } from 'vuex';

export default {
  name: 'clientes',
  data(){
      return {
          clientes: [],
          listaClientes: [],
          sucursal: {},
          excel: false,
          faltan: [],
          aviso: false,
          ruta: [],
          mensaje: {color: 'success', texto: ''},
          dismissSecs: 10,
          dismissCountDown: 0,
          contra: ''
      }
  },
  components: {
    navbar,
  },
  created(){
      this.ObtenerClientes();
  },
  methods: {
    ...mapActions(['guardarUsuario']),
    contraseña(){
      if(this.contra == 'agrosuperruta'){
        this.guardarUsuario()
        this.ObtenerClientes()
        Swal.fire(
          'Se ha ingresado al sistema correctamente',
          'Seleccione Ok para continuar',
          'success'
        )
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Contraseña Incorrecta',
          footer: 'Sin la contraseña no se puede acceder a los datos'
        })
      }
    },
    ObtenerClientes(){
      if(this.valido == true){
        this.axios.get(`http://localhost:8000/api/cliente/`)
          .then(res => {
            this.clientes = res.data;
            this.generarDemandas()
            const index = this.clientes.findIndex(item => item.tipo == 'Sucursal' || item.tipo == 'sucursal');
            this.sucursal = res.data[index]
            this.sucursal.macrozona = 'Deposito'
            this.clientes.splice(index, 1)
            this.macrozonas(true)
          })
          .catch(e => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se ha logrado obtener los clientes',
              footer: 'No se han logrado cargar a los clientes de la base de datos'
            })
        })
      }
    },
    macrozonas(){
      for(var i = 0; i < this.clientes.length; i++){
        if(this.clientes[i].zona == 'Andacollo'){
          this.clientes[i].macrozona = 'Andacollo'
        }
        else if(this.clientes[i].zona == 'Coquimbo' || this.clientes[i].zona == 'La Cantera' || this.clientes[i].zona == 'La Herradura'){
          this.clientes[i].macrozona = 'Coquimbo'
        }
        else if(this.clientes[i].zona == 'La Serena' || this.clientes[i].zona == 'La Florida' || this.clientes[i].zona == 'Las Compañias' || this.clientes[i].zona == 'Pampa Norte' || this.clientes[i].zona == 'Pampa Sur' || this.clientes[i].zona == 'Pan de Azucar'){
          this.clientes[i].macrozona = 'La Serena'
        }else if(this.clientes[i].zona == 'Guanaqueros' || this.clientes[i].zona == 'Tongoy'){
          this.clientes[i].macrozona = 'Guanaqueros'
        }else if(this.clientes[i].zona == 'Valle del Elqui'){
          this.clientes[i].macrozona = 'Valle del Elqui'
        }else if(this.clientes[i].zona == 'Tierras Blancas'){
          this.clientes[i].macrozona = 'Tierras Blancas'
        }else if(this.clientes[i].zona == 'Monte Patria' || this.clientes[i].zona == 'Tulahuen'){
          this.clientes[i].macrozona = 'Monte Patria'
        }else if(this.clientes[i].zona == 'Combarbala'){
          this.clientes[i].macrozona = 'Combarbala'
        }      
        else{
          this.clientes[i].macrozona = 'Ovalle'
        }
      }
    },
    generarDemandas(){
      for(var i = 0; i < this.clientes.length; i++){
        this.clientes[i].demanda = 0
      }
    },
    CambiaDemanda(i){
      let dias = i.dias
      if(i.demanda < 0){
        i.demanda = 0
        i.dias = 'l'
      } 
      i.dias = dias
    },
    Acteditar(codigo){
      router.push(`/editar/${codigo}`)
    },
    quitar(i){
      swal.fire({
          title: '¿Seguro que desea eliminar este cliente permanentemente?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: '¡Si!'
      }).then((result) => {
        if (result.value) {
          this.axios.delete(`http://localhost:8000/api/cliente/${i.codigo}`)
            .then(res => {
              const index = this.clientes.findIndex(item => item.codigo == i.codigo);
              this.clientes.splice(index, 1)
              Swal.fire(
                'Se ha quitado el cliente correctamente',
                'Seleccione Ok para continuar',
                'success'
              )
            })
            .catch(e => {
              var mensaje = 'Posible error del sistema';
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha podido eliminar al cliente',
                footer: mensaje
              })
            })
        }
      });
    },
    subirExcel(){
      const input = document.getElementById("Excel")
      readXlsFile(input.files[0]).then((rows) => {
          this.listaClientes = rows;
      })
      this.excel = true
    },
    cambiarClientes(){
      if((this.listaClientes[0][0] == 'Codigo' || this.listaClientes[0][0] == 'Código' || this.listaClientes[0][0] == 'Códigos' || this.listaClientes[0][0] == 'Codigos') && (this.listaClientes[0][1] == 'Demanda' || this.listaClientes[0][1] == 'Demandas')){
        let aux = []
        this.faltan = []
        for(var i = 1; i < this.listaClientes.length; i++){
          let cliente = {codigo: this.listaClientes[i][0], demanda: this.listaClientes[i][1]}
          const index = this.clientes.findIndex(item => item.codigo == cliente.codigo);
          if(index != -1){
            this.clientes[index].demanda = this.clientes[index].demanda + this.listaClientes[i][1]
          }else{
            this.faltan.push(this.listaClientes[i][0])
          }
        }
        for(var i = 0; i < this.clientes.length; i++){
          if(this.clientes[i].demanda > 0){
            aux.push(this.clientes[i])
          }
        }
        this.clientes = aux
        if(this.faltan.length > 0){
          this.alerta('warning', 'Se han encontrado registros cuyos valores no se han incorporado en la base de datos (Se encuentran en la parte inferior coloreados de rojo)')
        }
      }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Las columnas del archivo Excel deben ser "Código", "Demandas"',
            footer: 'Posible error de formato en el archivo'
          })
      }
    },
    GeneraRuta(){
      this.ruta = []
      this.ruta.push(this.sucursal)
      this.macrozonas()
      for(var i = 0; i < this.clientes.length; i++){
        if(this.clientes[i].demanda > 0){
          this.ruta.push(this.clientes[i])
        }
      }
      this.axios.post('http://localhost:8000/api/ruta/', this.ruta)
        .then(res => {
          router.push({path: '/mapa', query: {array: this.ruta, ruta: res.data.resultado, tiempos: res.data.tiempos}})
        })
        .catch(e => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha podido generar la ruta',
            footer: 'Posible error del sistema'
          })
        })
    },
    ImportarExcel(){
      this.$refs.file.click();
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs
    },
    alerta(color, texto){
      this.mensaje.color = color
      this.mensaje.texto = texto
      this.showAlert()
    }
  },
  //Prepara las tablas como Datatables de JQuery
  async mounted(){
    await $('#tablaCliente').DataTable()
  },
  watch: {
    clientes(val) {
      $('#tablaCliente').DataTable().destroy();
      this.$nextTick(()=> {
        $('#tablaCliente').DataTable()
      });
    }
  },
  computed: {
    ...mapState(['valido'])
  },
}
</script>

<style scoped>
  #centro {
    display: block;
  }
  .boton{
    margin: 20px;
    width: 90%;
    border-radius: 12px;
    border-color: black;
  }
  
</style>
