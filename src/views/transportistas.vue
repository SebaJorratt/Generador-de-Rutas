<template>
    <div class="transportistas">
      <navbar />
      <b-container>
        &nbsp;
        <h1>Gestión de transportistas</h1><br>
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
        <br>
        <b-row v-if="actAgregar == 0 && valido">
          <b-col cols="12" md="12">
            <div class="mb-3">
              <b-button @click="activarAgregar()" class="btn-success boton">Agregar Nuevo Transportista</b-button>
            </div>
          </b-col>
        </b-row>
        <div class="card" style="border-color: black;" v-if="actAgregar == 1 && valido">
          <div class="card-header"><br>
            <h2 class="card-title mb-4">Agregar transportista</h2>
          </div>
          <div class="card-body">
            <b-row>
              <b-col cols="12" md="4">
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Codigo del transportista</label>
                  <input type="text" class="form-control" id="codCliente" aria-describedby="emailHelp" v-model="nuevoTransportista.codigo">
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">Nombre del transportista</label>
                  <input type="text" class="form-control" id="codCliente" aria-describedby="emailHelp" v-model="nuevoTransportista.nombre">
                </div>
              </b-col>
              <b-col cols="12" md="4">
                <div class="mb-3">
                  <b-button @click="AgregarTransportista()" variant="primary" class=" boton">Agregar Transportista</b-button>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
        <br>
        <table class="table table-striped table-dark table-responsive-lg table-responsive-md" id="tablaTransportista" v-if="valido">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Nombre</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in transportistas" :key="i.codigo">
              <td scope="row">{{i.codigo}}</td>
              <td v-if="edicion == 0">{{i.nombre}}</td>
              <td v-if="edicion == 1"><input @change="EditarTransportista(i)" type="text" class="form-control" v-model="i.nombre" min="0"></td>
              <td>
                <b-button @click="quitarTransportista(i)" class="btn-danger btn-sm" style="border-color: white;">Eliminar</b-button>
              </td>
            </tr>
          </tbody>
        </table>
        <b-row v-if="valido">
          <b-col cols="12" md="12" v-if="edicion == 0">
            <b-button @click="actEditar()" class="btn-warning boton">Activar Edición</b-button>
          </b-col>
          <b-col cols="12" md="12" v-if="edicion == 1">
            <b-button @click="actEditar()" class="btn-warning boton">Desactivar Edición</b-button>
          </b-col>
        </b-row>
        <br>
      </b-container>
    </div>
  </template>
  
  <script>
  import navbar from "../components/navbar.vue";
  
  import 'jquery/dist/jquery.min.js';
  import "datatables.net-dt/js/dataTables.dataTables"
  import "datatables.net-dt/css/jquery.dataTables.min.css"
  import $ from 'jquery'; 

  import { mapState } from 'vuex'
  import { mapActions } from 'vuex';

  export default {
    name: 'transportistas',
    data(){
        return {
          nuevoTransportista: {codigo: '', nombre: '', numero: 0},
          actAgregar: 0,
          transportistas: [],
          edicion: 0,
          mensaje: {color: 'success', texto: ''},
          dismissSecs: 5,
          dismissCountDown: 0
        }
    },
    components: {
      navbar
    },
    created(){
      this.obtenerTransportistas()
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
      obtenerTransportistas(){
        this.axios.get(`http://localhost:8000/apiTransportistas/transportista/`)
          .then(res => {
            this.transportistas = res.data;
          })
          .catch(e => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se ha actualizado el equipo',
              footer: 'No se han logrado cargar a los transportistas de la base de datos'
            })
        })
      },
      Obtenernumero(){
        this.axios.get(`http://localhost:8000/apiTransportistas/numero/`)
        .then(res => {
          this.nuevoTransportista.numero = res.data.valor
          console.log(this.nuevoTransportista.numero)
        })
        .catch(e => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error del sistema',
            footer: 'No se han logrado cargar un dato de la base de datos.'
          })
        })
      },
      activarAgregar(){
        this.actAgregar = 1
        this.nuevoTransportista = {codigo: '', nombre: '', numero: 0}
        this.Obtenernumero();
      },
      actEditar(){
        if(this.edicion == 1){
          this.edicion = 0
        }else{
          this.edicion = 1
        }
      },
      AgregarTransportista(){
        if(this.nuevoTransportista.codigo == "" || this.nuevoTransportista.nombre == ""){
          this.alerta('danger', 'Se requiere de algún código o nombre para agregar al transportista')
        }else{
          this.axios.post('http://localhost:8000/apiTransportistas/transportista/', this.nuevoTransportista)
            .then(res => {
                Swal.fire(
                  'Se ha generado una nuevo transportista ',
                  'Seleccione Ok para continuar',
                  'success'
                )
                this.actAgregar = 0
                this.transportistas.push(this.nuevoTransportista)
            })
            .catch(e => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha logrado crear este nuevo transportista',
                footer: 'Posible error del sistema'
              })
          })
        }
      },
      quitarTransportista(i){
        swal.fire({
          title: '¿Seguro que desea eliminar este transportista permanentemente?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: '¡Si!'
        }).then((result) => {
          if (result.value) {
            this.axios.delete(`http://localhost:8000/apiTransportistas/transportista/${i.codigo}/`)
              .then(res => {
                const index = this.transportistas.findIndex(item => item.codigo == i.codigo);
                this.transportistas.splice(index, 1)
                Swal.fire(
                  'Se ha quitado al transportista seleccionado!',
                  'Seleccione Ok para continuar',
                  'success'
                )
                this.Obtenernumero();
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
      EditarTransportista(transportista){
        if(transportista.nombre == ""){
          this.alerta('danger', 'Se requiere de algún nombre para editar al transportista')
        }else{
          this.axios.put(`http://localhost:8000/apiTransportistas/transportista/${transportista.codigo}/`, {codigo: transportista.codigo, nombre: transportista.nombre, numero: transportista.numero})
            .then(res => {
                Swal.fire(
                  'Se ha editado al transportista satisfactoriamente',
                  'Seleccione Ok para continuar',
                  'success'
                )
            })
            .catch(e => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha logrado editar al transportista',
                footer: 'Posible error del sistema'
              })
          })
        }
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
      await $('#tablaTransportista').DataTable()
    },
    watch: {
      transportistas(val) {
        $('#tablaTransportista').DataTable().destroy();
        this.$nextTick(()=> {
          $('#tablaTransportista').DataTable()
        });
      }
    },
    computed: {
      ...mapState(['valido'])
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
  </style>
  