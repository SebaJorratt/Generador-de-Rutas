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
          <h1 class="card-title mb-4">Editar Cliente</h1>
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
                <input type="text" disabled class="form-control" id="codCliente" aria-describedby="emailHelp" v-model="codCliente">
              </div>
            </b-col>
            <b-col cols="12" md="4">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Nombre del cliente</label>
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
              <div class="mb-1" v-if="actDias == 1">
                <input type="checkbox" @click="ckeckCambio(0)" id="checkbox" v-model="dias[0].valor"> Lunes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(1)" id="checkbox" v-model="dias[1].valor"> Martes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(2)" id="checkbox" v-model="dias[2].valor"> Miercoles &nbsp; 
                <input type="checkbox" @click="ckeckCambio(3)" id="checkbox" v-model="dias[3].valor"> Jueves &nbsp;  
                <input type="checkbox" @click="ckeckCambio(4)" id="checkbox" v-model="dias[4].valor"> Viernes &nbsp; 
                <input type="checkbox" @click="ckeckCambio(5)" id="checkbox" v-model="dias[5].valor"> Sábado &nbsp; 
                <input type="checkbox" @click="ckeckCambio(6)" id="checkbox" v-model="dias[6].valor"> Domingo 
              </div>
              <div v-if="actDias == 0">
                <b-button @click="ActDias()" class="botonDias btn-success">Editar Días</b-button>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="12" md="6">
              <b-button @click="Volver()" class="boton">Volver al Listado</b-button>
            </b-col>
            <b-col cols="12" md="6">
              <b-button @click="Editar()" variant="primary" class="boton">Editar Cliente</b-button>
            </b-col>
          </b-row>
        </div>
      </div>
    </b-container>
  </div>
  </template>
  
  <script>
  import navbar from "../components/navbar.vue";
  import router from '@/router';

  import { mapState } from 'vuex'
  import { mapActions } from 'vuex';

  export default {
    name: 'editar',
    data(){
        return {
          codCliente: '',
          cliente: {nombre: '', dias: '', longitud: '', latitud: '', tipo: 'Tradicional', sector: '', zona: '', direccion: ''},
          tipos: [{tipoCliente: 'Foodservice'}, {tipoCliente: 'Tradicional'}, {tipoCliente: 'Supermercados'}, {tipoCliente: 'Grandes Clientes'}],
          zonas: [{zona: 'Pampa Norte'}, {zona: 'Pampa Sur'}, {zona: 'Cerrillos'}, {zona: 'Coquimbo'}, {zona: 'La Cantera'}, {zona: 'La Florida'}, {zona: 'La Herradura'}, {zona: 'La Serena'}, {zona: 'Las Compañias'}, {zona: 'Monte Patria'}, {zona: 'Ovalle'}, {zona: 'Pan de Azucar'}, {zona: 'Punitaqui'}, {zona: 'Tierras Blancas'}, {zona: 'Tongoy'}, {zona: 'Valle del Elqui'}, {zona: 'Andacollo'}],
          dias: [{dia: 'Lunes', valor: 0}, {dia: 'Martes', valor: 0}, {dia: 'Miercoles', valor: 0}, {dia: 'Jueves', valor: 0}, {dia: 'Viernes', valor: 0}, {dia: 'Sábado', valor: 0}, {dia: 'Domingo', valor: 0}],
          actDias: 0,
          mensaje: {color: 'success', texto: ''},
          dismissSecs: 5,
          dismissCountDown: 0
        }
    },
    components: {
      navbar
    },
    created(){
        this.ObtenerCliente()
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
      ObtenerCliente(){
          this.codCliente = this.$route.params.cod
          this.axios.get(`http://localhost:8000/api/cliente/${this.codCliente}`)
          .then(res => {
            this.cliente = res.data
          })
          .catch(e => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se ha podido ingresar a los datos de este cliente',
              footer: 'Posible error del sistema'
            })
          })
      },
      Editar(){
        if(this.codCliente == "" || this.cliente.longitud == null || this.cliente.latitud == null || this.cliente.direccion == "" || this.cliente.zona == ""){
          this.alerta('danger', 'Se requiere de un codigo, longitud, latitud, dirección y zona para actualizar el cliente')
        }else{
          this.axios.put(`http://localhost:8000/api/cliente/${this.codCliente}/`, this.cliente)
            .then(res => {
                Swal.fire(
                  'Se ha editado al cliente satisfactoriamente',
                  'Seleccione Ok para continuar',
                  'success'
                )
            })
            .catch(e => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha logrado editar al cliente',
                footer: 'Posible error del sistema'
              })
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
      Volver(){
          router.push("/")
      },
      ActDias(){
        this.cliente.dias = ''
        this.actDias = 1
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

    .botonDias{
      width: 30%;
      border-radius: 6px;
      border-color: black;
    }
  </style>
  