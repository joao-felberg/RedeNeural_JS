<!-- aprendizados:
1. usar v-for em <template> faz com que apenas o conteudo de dentro 
  do template seja renderizado;
2. A seção 'computed' da instancia VUE executa suas funções apenas 
  se a função utilizar uma variável que foi alterada;
 -->

// HTML code
<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar>
        <v-toolbar-title class="headline text-uppercase">
          <span>EzWin</span>
          <span class="font-weight-light"> IZI MANY BABY</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-app-bar>

    <v-content>
      <v-btn text @click="loadData" target="_blank">
        <span class="mr-2">Carregar dados</span>
      </v-btn>

      <v-btn text @click="saveFile" target="_blank">
        <span class="mr-2">Guardar dados</span>
      </v-btn>

      <v-btn text @click="teste2" target="_blank">
        <span class="mr-2">propagate fwd</span>
      </v-btn>

      <v-btn text @click="teste3" target="_blank">
        <span class="mr-2">back propagate</span>
      </v-btn>      

      <!-- input da definição da estrutura da rede neural -->
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>          
          <v-flex xs4>
            <v-card dark color="orange">
              <v-card-text class="px-0"> 
                <v-text-field v-model="structure" type="text" id="inp" ></v-text-field>
                <v-btn text @click="teste" target="_blank">
                  <span class="mr-2">Gerar Rede</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- pre-vizualização da estrutura da rede neural -->
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>          
          <v-flex :key="index" v-for="(item, index) in net" xs3>
            <v-card :key="index" v-for="(el, index) in item" dark color="primary">
              <v-card-text class="px-0"> 
                {{el}}
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- lista de resultados anteriores -->
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>          
          <v-flex :key="item" v-for="item in numbers" xs12>
            <v-card dark color="primary">
              <v-card-text class="px-0"> 
                {{item}}
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

    </v-content>

  </v-app>
</template>

// Vue code
<script>
  import file from '!raw-loader!../loto_facil.txt';
  var network = require('./components/neural');

  export default {
    name: 'App',
    components: {
    },
    data () { 
      return {
        data: file,
        numbers: [],
        structure: "",
        neuron: new network.neuron(),
        layer: new network.layer(),
        ann: new network.ann(),
        net: []
      }
    },
    methods: {
      // Carrega os dados de treinamento
      loadData: function() {
        this.numbers = this.data.split('\n');
      },

      // Faz o download da rede
      saveFile: function() {
        // Dados do arquivo
        const data = this.ann.getAnnStr();
        const blob = new Blob([data], {type: 'text/plain'});
        const e = document.createEvent('MouseEvents');
        const a = document.createElement('a');
        // Nome do arquivo
        a.download = "rede.txt";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      },

      // Função para testes
      teste: function(){
        this.ann.setAnn(this.structure.split(','));
        this.net = this.ann.getAnnArr();
      },
      // Função para testes
      teste2: function(){
        // O label correto para o exemplo
        var label = [0,0,1,0];

        // executa um fluxo de forward propagation retornando o cost
        var aux = this.ann.forwardProp(this.ann, label);
        
        // Exibe o Cost
        console.log(aux);

        this.net = this.ann.getAnnArr();
      },
      // Função para testes
      teste3: function(){
        // O label correto para o exemplo
        var label = [0,0,1,0];

        // executa um fluxo de back propagation
        this.ann.backProp(this.ann, label);

        this.net = this.ann.getAnnArr();
      }
    }
  }
</script>

// CSS code
<style>
  #inp{
    background-color: #fff;
    color: black;
  }
</style>
