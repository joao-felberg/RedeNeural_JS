const math = require('mathjs');

// ----------------------------------- neuronio ---------------------------------------------
var neuron = function(a, bias){
    if (!isNaN(a)){
        this.a = a;
    }else{
        this.a = Math.random() * 1;
    }
    
    if (!isNaN(bias)){
        this.bias = bias;
    }else{
        this.bias = Math.floor(Math.random() * 10) - 5;
    }
}

// ------------------------------------- layer ----------------------------------------------
var layer = function (){
    this.neurons = new Array();
    this.w;
    this.nW = 0;
    this.type;

    // gera um array de neuronios com nNeurons
    this.setLayer = function(nNeurons, nW, type){
        // Define o tipo do layer. Pode ser: 'i'(in), 'o'(out),  'h'(hidden)
        this.type = type;

        // Define a quantidade de linhas que haverá na matriz de calculo.
        // Essa quantidade de linhas representa o numero de neurônios da
        // proxima camada
        if (nW > 0){
            this.nW = nW;
        }

        // Gera a matriz de pesos 'w' randomicamente
        this.w = math.random([nW, nNeurons], -1, 1);

        // Gera os neurônios do layer
        for (var i = 0; i < nNeurons; i++){
            this.neurons.push(new neuron());
        }
    }

    // Altera os valores dos neurônio do layer (a)
    this.setNeurons = function(neurons){
        for (var i = 0; i < this.neurons.length; i++) {
           this.neurons[i].a = neurons[i];
        }
    }
    
    // Retorna os valores de 'a' e o bias dos neurônios do layer como array
    this.getLayerArr = function(){
        var values = new Array();
        
        // Monta o array do layer
        for (var i = 0; i < this.neurons.length; i++){
            values.push(this.neurons[i].a +' ('+ this.neurons[i].bias + ') ');
        }
        
        return values;
    }

    // Retorna os valores de 'a', 'w' e o bias dos neurônios do layer em string
    this.getLayerStr = function(){
        var values = "";
        var a = "";
        var bias = "";
        
        // Monta a string de retorno
        for (var i = 0; i < this.neurons.length; i++){
            a += this.neurons[i].a;
            bias += this.neurons[i].bias;

            if (i+1 < this.neurons.length){
                a += ',';
                bias += ',';
            }
        }

        values = 'a={'+ a +'} b=('+ bias + ') w=['+ this.w +'] ###\n';
        
        return values;
    }

    // Retorna a matriz de pesos do layer (w)
    this.getWeigths = function(){
        return this.w;
    }

    // Retorna o vetor de valores dos neurônios (a)
    this.getNeurons = function(){
        var values = new Array();

        // Monta o array de retorno
        for (var i = 0; i < this.neurons.length; i++){
            values.push(this.neurons[i].a);
        }

        return values;
    }

    // Retorna o vetor de bias dos neurônios
    this.getBias = function(){
        var values = new Array();

        // Monta o array de retorno
        for (var i = 0; i < this.neurons.length; i++){
            values.push(this.neurons[i].bias);
        }

        return values;
    }
}

// ---------------------------------- Rede Neural -------------------------------------------
var ann = function (){
    this.layers = new Array();
    this.cost = 0; 
    
    // Gera a Rede neural baseado nos valores passados em 'structure'
    ann.prototype.setAnn = function(structure = []){
        // Limpa o cost atual da rede
        this.cost = 0;
        // Limpa as informações armazenadas nos 'layers'
        this.layers = new Array();

        // Camada de entrada
        this.layers[0] = new layer();
        this.layers[0].setLayer(structure[0], structure[1], 'i');

        // Camada(s) intermediária(s)
        for (var i = 1; i < structure.length - 1; i++){
            this.layers[i] = new layer();
            // structure[i+1] acessa o número de neurônios da próxima camada
            this.layers[i].setLayer(structure[i], structure[i+1], 'h');
        }

        // Camada de saída. Obs: nW recebe -1 pois a camada de saída não possui pesos 'w'
        this.layers[structure.length - 1] = new layer();
        this.layers[structure.length - 1].setLayer(structure[structure.length - 1], -1, 'o');
    }

    // Retorna os valores de 'a' e o bias dos neurônios de cada layer da ann como Array
    ann.prototype.getAnnArr = function(){
        var values = new Array();
        
        // Monta o Array de retorno
        for (var i = 0; i < this.layers.length; i++){
            values.push(this.layers[i].getLayerArr());
        }
        
        return values;
    }

    // Retorna os valores de 'a' e o bias dos neurônios de cada layer da ann em string
    ann.prototype.getAnnStr = function(){
        var values = "";
        
        // Monta a string de retorno
        for (var i = 0; i < this.layers.length; i++){
            values += this.layers[i].getLayerStr() + '\n *&* \n';
        }

        return values;
    } 

    // Retorna a matriz de pesos do layer (w)
    ann.prototype.getWeigths = function(){
        var values = new Array();

        // Monta o Array de retorno
        for (var i = 0; i < this.layers.length; i++){
            values.push(this.layers[i].getWeigths() + '#\n');
        }
        
        return values;
    }
}

// Retorna o calcula de (w . a) + b
ann.prototype.propagate = function(w, a, bias){
    var values = new Array();

    // Calcula a multiplicação dos valores dos neurônios pelos pesos
    values = math.multiply(w, a);

    // Soma o vetor resultante com o bias
    values = math.add(values, bias);

    return values; 
}

// Aplica o método 'Relu' ao array 'a'
ann.prototype.Relu = function(a){
    for (var i = 0; i < a.length; i++){
        if(a[i] < 0){
            a[i] = 0;
        }
    }

    return a;
}

// Calcula o 'Cost' com 'MSE' Mean Square Error
ann.prototype.Cost = function(a, labels){
    var value = 0;

    for(var i = 0; i < a.length; i++){
        value += Math.pow((a[i] - labels[i]), 2);  
    }
    value = 1 / labels.length * value;

    return value;
}

// Executa a etapa de 'forward propagation'
ann.prototype.forwardProp = function(net, labels){
    var result = 0;
    var tmp;

    // Percorre os layers da rede executando a propagação da informação
    // Obs: Não executa com o ultimo layer por o mesmo não possui pesos 'w'
    for (var i = 0; i < net.layers.length - 1; i++){
        tmp = net.Relu(net.propagate(
            net.layers[i].getWeigths(), 
            net.layers[i].getNeurons(), 
            net.layers[i+1].getBias())
            );

        net.layers[i+1].setNeurons(tmp);
    }

    // Calcula o cost
    result = net.Cost(net.layers[net.layers.length - 1].getNeurons(), labels);

    return result;
}

// Executa o back propagation com o valor do cost
ann.prototype.backProp = function(net, labels){
    // As derivadas parciais necessárias
    var der1, der2, der3;
    // Taxa de aprendizado (fator de multiplicação pela correção nos pesos)
    var learn_rate = 0.1;
    // Armazena os valores de correções para os pesos (w) 
    var weights = new Array();
    // Armazena derivadas já calculadas que serão reutilizdas dinamicamente
    var calculations = new Array();

    // Cria uma matriz com todos os pesos w atuais da rede neural
    for (var i = 0; i < (net.layers.length - 1); i++){
        weights.push(net.layers[i].getWeigths());
    }

    // ********************************** Backpropagation *********************************************
    // Percorre os layers da tras para frente
    for (i = weights.length - 1; i >= 0; i--){ 
        // Percorre os pesos do layer i como vetores
        for (var j = 0; j < weights[i].length; j++){
            // Percorre os valores do vetor de pesos j do layer i
            for (var k = 0; k < weights[i][j].length; k++){
                // Derivada da soma dos pesos com relação ao peso atual
                der1 = net.layers[i].neurons[k].a;
        
                // Derivada da ativação do neurônio (Relu da soma dos pesos) com relação a soma dos pesos
                if (net.layers[i+1].neurons[j].a < 0){
                    der2 = 0;
                }else{
                    der2 = 1;
                }
        
                // Derivada do cost com relação a ativação do neurônio (Relu da soma dos pesos)
                der3 = 2 * (net.layers[i+1].neurons[j].a - labels[j]);

                // Ajusta o peso de acordo com os resultados das derivadas parciais
                weights[i][j][k] = weights[i][j][k] - (learn_rate * der1 * der2 * der3);
            }
            console.log('\n');
        }
    }

    calculations[0] = learn_rate * der1 * der2 * der3;
    console.log('\n potatoshit: '+ calculations);
    
    // ************************************************************************************************
}

//===================================================================================================

// Realiza a exportação dos objetos do arquivo para que possam ser usados
// em outro arquivo
module.exports = {neuron, layer, ann};