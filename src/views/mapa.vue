<template>
  <div class="mapa">
    <navbar />
    <b-container>
      &nbsp;
      <h1>Mapa de las rutas</h1>
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
      <div class="col-12" v-if="valido">
        <mapaRutas />
      </div>
    </b-container>
  </div>
</template>

<script>
import mapaRutas from '../components/mapaRutas.vue'
import navbar from "../components/navbar.vue";

import { mapState } from 'vuex'
import { mapActions } from 'vuex';

export default {
  name: 'mapa',
  components: {
    mapaRutas,
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

