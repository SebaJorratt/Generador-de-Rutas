<template>
    <div class="hello"> 
        <div id="navegador">
            <b-navbar toggleable="md" type="white" variant="light">
                <b-container>
                    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                    <b-container>
                        <b-collapse id="nav-collapse" is-nav>
                            <b-nav pills>&nbsp; &nbsp; &nbsp; &nbsp; 
                                <b-nav-item  :active="esActivoRuta" :to="{name:'clientes'}" >Determinar Ruta</b-nav-item> &nbsp; &nbsp; 
                                <b-nav-item  :active="esActivoAgregar" :to="{name:'agregar'}">Agregar Cliente</b-nav-item> &nbsp; &nbsp; 
                                <b-nav-item  :active="esActivoGestion" :to="{name:'transportistas'}">Gestión de Transportistas</b-nav-item>
                            </b-nav>
                        </b-collapse>
                    </b-container> 
                </b-container>
            </b-navbar>
        </div>
    </div>
</template>

<script>
import router from '@/router'

export default {
    name: "navbar",
    data(){
        return {
            esActivoRuta: false,
            esActivoAgregar: false,
            esActivoGestion: false
        }
    },
    created(){
        this.seleccion();
    },
    methods: {
        seleccion(){
            switch (router.currentRoute.name) {
                case 'transportistas':
                    this.esActivoAgregar = false
                    this.esActivoGestion = true
                    this.esActivoRuta = false
                    break;
    
                case 'agregar':
                    this.esActivoAgregar = true
                    this.esActivoGestion = false
                    this.esActivoRuta = false
                    break;

                default:
                    this.esActivoAgregar = false
                    this.esActivoGestion = false
                    this.esActivoRuta = true
                    break;
            }
        }
    }
}
</script>
<style>
    #dropdownMenuButton1{
        color: #F8F8FF;
    }

</style>

