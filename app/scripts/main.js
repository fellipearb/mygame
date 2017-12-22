"use strict";

let app = {
    canvas: document.createElement("canvas"),
    ctx: undefined,
    altura: window.innerHeight,
    largura: window.innerWidth,
    frames: 0,
    pulos: 3,
    velocidade: 6,
    estadoAtual: 0,
    estados: {
        jogar: 0,
        jogando: 1,
        perdeu: 2
    },
    colisao: {

    },
    objects: {
        chao: {
            y: 550,
            altura: 50,
            cor: '#ffdf70',
            desenha: function() {
                this.y = app.altura - this.altura

                app.ctx.fillStyle = this.cor
                app.ctx.fillRect(0, this.y, app.largura, this.altura)
            }
        },
        figure: {
            x: 50,
            y: 0,
            altura: 50,
            largura: 50,
            cor: "#ff4e4e",
            gravidade: 1.6,
            velocidade: 0,
            forca: 23.6,
            pulos: 0,
            atualiza: function() {
                this.velocidade += this.gravidade
                this.y += this.velocidade

                if( this.y > app.objects.chao.y - this.altura ) {
                    this.y = app.objects.chao.y - this.altura
                    this.pulos = 0
                }
            },
            pula: function() {
                if( this.pulos >= app.pulos )
                    return false

                this.velocidade = -this.forca
                this.pulos++
            },
            desenha: function() {
                app.ctx.fillStyle = this.cor
                app.ctx.fillRect(this.x, this.y, this.largura, this.altura)
            }
        },
        obstaculos: {
            x: 50,
            y: 0,
            altura: 0,
            largura: 0,
            elementos: [],
            cores: ["#FF00FF", "#EE82EE", "#DDA0DD", "#A020F0"],
            tempo: 0,
            insere: function() {
                this.elementos.push({
                    x: app.largura,
                    largura: 30 + Math.floor(21 * Math.random()),
                    altura: 30 + Math.floor(60 * Math.random()),
                    cor: this.cores[Math.floor(5 * Math.random())]
                })

                this.tempo += 30 + Math.floor(20 * Math.random());
            },
            atualiza: function() {
                if( this.tempo == 0 )
                    this.insere()
                else
                    this.tempo--

                for( var i = 0; i < this.elementos.length; i++ ) {
                    var atual = this.elementos[i]
                    atual.x -= app.velocidade

                    if( 
                        app.objects.figure.x < atual.x + atual.largura && 
                        app.objects.figure.x + app.objects.figure.largura >= atual.x &&
                        app.objects.figure.y + app.objects.figure.altura >= app.objects.chao.y - atual.altura 
                    ) {
                        app.estadoAtual = app.estados.perdeu
                    } 
                    
                    if( this.elementos.length > 9 ) {
                        this.elementos.splice(0, 1)
                    }                                
                }
            },
            limpa: function() {
                this.elementos = []
            },
            desenha: function() {
                for( var i = 0, tam = this.elementos.length; i < tam; i++ ) {
                    var atual = this.elementos[i]
                    app.ctx.fillStyle = atual.cor
                    app.ctx.fillRect(atual.x, app.objects.chao.y - atual.altura, atual.largura, atual.altura )
                }
            }
        }
    }
}

function clique(){
    if( app.estadoAtual = app.estados.jogando )
        app.objects.figure.pula()        
    
    else if( app.estadoAtual = app.estados.jogar )
        app.estadoAtual = app.estados.jogando

    else if( app.estadoAtual = app.estados.perdeu )
        app.estadoAtual = app.estados.jogar
}
function roda(){
    atualiza()
    desenha()

    window.requestAnimationFrame(roda)
}
function atualiza(){
    app.frames++
    app.objects.figure.atualiza()

    if( app.estadoAtual == app.estados.jogando )
        app.objects.obstaculos.atualiza()

    if( app.estadoAtual == app.estados.perdeu )
        app.objects.obstaculos.limpa()
}
function desenha(){
    app.ctx.fillStyle = "#87CEFA"
    app.ctx.fillRect(0, 0, app.altura, app.largura)

    if( app.estadoAtual == app.estados.jogar ) {
        app.ctx.fillStyle = "#00F5FF"
        app.ctx.fillRect(app.largura/2 - 50, app.altura/2 - 50, 100, 100)
    } else if( app.estadoAtual == app.estados.perdeu ) {
        app.ctx.fillStyle = "#CD3333"
        app.ctx.fillRect(app.largura/2 - 50, app.altura/2 - 50, 100, 100)
    } else if( app.estadoAtual == app.estados.jogando ) {
        app.objects.obstaculos.desenha()
    } 

    app.objects.chao.desenha()
    app.objects.figure.desenha()
}
(function main(){
    console.info('!>>>>')
    console.info('STARTED APP', app, app.altura, app.largura )
    console.info('<<<<!')
    if( app.largura >= 500 ) {
        app.altura = 600
        app.largura = 600
    } else {
        app.altura = 320
        app.largura = 320
    }

    app.canvas.width = app.largura
    app.canvas.height = app.altura
    app.canvas.style.border = "10px solid #1E90FF"

    app.ctx = app.canvas.getContext("2d")
    document.body.appendChild(app.canvas)
    document.addEventListener("mousedown", clique)

    roda();

    console.info('!>>>>')
    console.info('RUNING APP', app)
    console.info('<<<<!')
})()