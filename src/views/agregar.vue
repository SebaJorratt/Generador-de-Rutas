<template>
  <div class="editar">
    <navbar />
    <b-container>
      <br><br><br><br>
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
      <div class="card" style="border-color: black;" v-if="valido">
        <div class="card-header">
          <br>
          <h1 class="card-title mb-4">Agregar Cliente</h1>
        </div>
        <b-alert
            :show="dismissCountDown"
            dismissible
            :variant="mensaje.color"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged"
          >
            {{mensaje.texto}}
        </b-alert>
        <div class="card-body">
          <b-row>
            <b-col cols="12" md="4">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Codigo del cliente</label>
                <input type="text" class="form-control" id="codCliente" aria-describedby="emailHelp" v-model="codCliente">
              </div>
            </b-col>
            <b-col cols="12" md="4">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Razon Social</label>
                <input type="text" class="form-control" id="nombre" aria-describedby="emailHelp" v-model="cliente.nombre">
              </div>
            </b-col>
            <b-col cols="12" md="4">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Tipo de cliente</label>
                <select class="form-control" v-model="cliente.tipo">
                  <option v-for="i in tipos" :key="i.tipoCliente">{{i.tipoCliente}}</option>
                </select>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Dirección del cliente</label>
                <input type="text" class="form-control" id="direccion" aria-describedby="emailHelp" v-model="cliente.direccion">
              </div>
            </b-col>
            <b-col cols="6" md="3">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Sector del cliente</label>
                <input type="text" class="form-control" id="sector" aria-describedby="emailHelp" v-model="cliente.sector">
              </div>
            </b-col>
            <b-col cols="6" md="3">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Zona del cliente</label>
                <select class="form-control" v-model="cliente.zona">
                  <option v-for="i in zonas" :key="i.zona">{{i.zona}}</option>
                </select>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Longitud</label>
                <input type="number" class="form-control" id="longitud" aria-describedby="emailHelp" v-model="cliente.longitud">
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Latitud</label>
                <input type="number" class="form-control" id="latitud" aria-describedby="emailHelp" v-model="cliente.latitud">
              </div>
            </b-col>
            <b-col cols="12" md="6">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Días de Entrega</label>
                <input type="text" class="form-control" id="dias" aria-describedby="emailHelp" v-model="cliente.dias">
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Selección de días</label>
              </div>
              <div class="mb-1">
                <input type="checkbox" @click="ckeckCambio(0)" id="checkbox" v-model="dias[0].valor"> Lunes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(1)" id="checkbox" v-model="dias[1].valor"> Martes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(2)" id="checkbox" v-model="dias[2].valor"> Miercoles &nbsp; 
                <input type="checkbox" @click="ckeckCambio(3)" id="checkbox" v-model="dias[3].valor"> Jueves &nbsp;  
                <input type="checkbox" @click="ckeckCambio(4)" id="checkbox" v-model="dias[4].valor"> Viernes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(5)" id="checkbox" v-model="dias[5].valor"> Sábado &nbsp; 
                <input type="checkbox" @click="ckeckCambio(6)" id="checkbox" v-model="dias[6].valor"> Domingo 
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6" v-if="excel == false">
              <input id="Excel" type="file" @change="subirExcel()" style="display:none" ref="file"/>
              <b-button class="btn-success boton" @click="ImportarExcel()">Importar Excel</b-button>
            </b-col>
            <b-col cols="12" md="3" v-if="excel">
              <input id="Excel" type="file" @change="subirExcel()" style="display:none" ref="file"/>
              <b-button class="btn-success boton" @click="ImportarExcel()">Importar Excel</b-button>
            </b-col>
            <b-col cols="12" md="3" v-if="excel">
              <input id="Excel" type="file" @change="subirExcel()" style="display:none" ref="file"/>
              <b-button class="btn-warning boton" @click="agregaClientes()">Agregar Datos</b-button>
            </b-col>
            <b-col cols="12" md="6">
              <b-button @click="Agregar()" variant="primary" class="boton">Agregar Cliente</b-button>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>
  </div>
  </template>
  
  <script>
  import navbar from "../components/navbar.vue";
  import readXlsFile from "read-excel-file";

  import { mapState } from 'vuex'
  import { mapActions } from 'vuex';
  
  export default {
    name: 'editar',
    data(){
        return {
            codCliente: '',
            cliente: {nombre: '', dias: '', longitud: 0, latitud: 0, tipo: 'Tradicional', sector: '', zona: 'Balmaceda', direccion: ''},
            tipos: [{tipoCliente: 'Foodservice'}, {tipoCliente: 'Tradicional'}, {tipoCliente: 'Supermercados'}, {tipoCliente: 'Grandes Clientes'}],
            zonas: [{zona: 'Pampa Norte'}, {zona: 'Pampa Sur'}, {zona: 'Cerrillos'}, {zona: 'Coquimbo'}, {zona: 'La Cantera'}, {zona: 'La Florida'}, {zona: 'La Herradura'}, {zona: 'La Serena'}, {zona: 'Las Compañias'}, {zona: 'Monte Patria'}, {zona: 'Ovalle'}, {zona: 'Pan de Azucar'}, {zona: 'Punitaqui'}, {zona: 'Tierras Blancas'}, {zona: 'Tongoy'}, {zona: 'Valle del Elqui'}, {zona: 'Andacollo'}],
            dias: [{dia: 'Lunes', valor: 0}, {dia: 'Martes', valor: 0}, {dia: 'Miercoles', valor: 0}, {dia: 'Jueves', valor: 0}, {dia: 'Viernes', valor: 0}, {dia: 'Sábado', valor: 0}, {dia: 'Domingo', valor: 0}],
            mensaje: {color: 'success', texto: ''},
            dismissSecs: 5,
            dismissCountDown: 0,
            excel: false,
            listaClientes: [],
            clientes: [],
            contra: ''
        }
    },
    components: {
      navbar
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
      ckeckCambio(dia){
        if(this.dias[dia].valor == 1){
          for(var i = 0; i < this.cliente.dias.length; i++){
            if(this.cliente.dias[i] == this.dias[dia].dia[0] && this.cliente.dias[i+1] == this.dias[dia].dia[1] && this.cliente.dias[i+2] == this.dias[dia].dia[2]){
              const str1 = this.cliente.dias.slice(0, i)  
              const str2 = this.cliente.dias.slice(i + this.dias[dia].dia.length + 1, this.cliente.dias.length)  
              this.cliente.dias = str1 + str2
            }
          }
        }else{
          this.cliente.dias = this.cliente.dias + this.dias[dia].dia + ' ';
        }
      },
      Agregar(){
        if(this.codCliente == "" || this.cliente.longitud == null || this.cliente.latitud == null || this.cliente.direccion == "" || this.cliente.zona == ""){
          this.alerta('danger', 'Se requiere un codigo, longitud, latitud, dirección y zona para crear un nuevo cliente')
        }else{
          this.cliente.codigo = this.codCliente
          this.axios.post('http://localhost:8000/api/cliente/', this.cliente)
              .then(res => {
                  Swal.fire(
                    'Se ha generado una nuevo cliente ',
                    'Seleccione Ok para continuar',
                    'success'
                  )
              })
              .catch(e => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'No se ha logrado crear este nuevo cliente',
                  footer: 'Posible error del sistema'
                })
              })
        }
      },
      subirExcel(){
        const input = document.getElementById("Excel")
        readXlsFile(input.files[0]).then((rows) => {
            this.listaClientes = rows;
        })
        this.excel = true
      },
      agregaClientes(){
        this.clientes = []
        if((this.listaClientes[0][0] == 'Codigo' || this.listaClientes[0][0] == 'Código') && (this.listaClientes[0][1] == 'Razon' || this.listaClientes[0][1] == 'Razón') && this.listaClientes[0][2] == 'Domicilio' && this.listaClientes[0][3] == 'Tipo' && this.listaClientes[0][4] == 'Latitud' && this.listaClientes[0][5] == 'Longitud' && (this.listaClientes[0][6] == 'Dias' || this.listaClientes[0][6] == 'Días') && this.listaClientes[0][7] == 'Sector' && this.listaClientes[0][8] == 'Zona'){
          for(var i = 1; i<this.listaClientes.length; i++){
            var clienteAct = {codigo: this.listaClientes[i][0], nombre: this.listaClientes[i][1], direccion: this.listaClientes[i][2], tipo: this.listaClientes[i][3], latitud: this.listaClientes[i][4], longitud: this.listaClientes[i][5], dias: this.listaClientes[i][6], sector: this.listaClientes[i][7], zona: this.listaClientes[i][8]}
            this.clientes.push(clienteAct)
          }
          this.subirClientes()
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Las columnas del archivo Excel deben ser "Código", "Razon", "Domicilio", "Tipo", "Latitud", "Longitud", "Días", "Sector", "Zona"',
            footer: 'Posible error de formato en el archivo'
          })
        }
      },
      subirClientes(){
        this.axios.put('http://localhost:8000/api/ruta/', this.clientes)
          .then(res => {
              Swal.fire(
                'Se han generado nuevos clientes',
                'Seleccione Ok para continuar',
                'success'
              )
          })
          .catch(e => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se ha logrado crear estos nuevos clientes',
              footer: 'Posible error del sistema, asegurese de que algún código no exista ya en el sistema'
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
    computed: {
      ...mapState(['valido'])
    },
  };
  </script>
  
  <style scoped>
    .boton{
      margin: 20px;
      width: 90%;
      border-radius: 12px;
      border-color: black;
    }
  </style>
  