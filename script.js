const telas = {
  inicial: document.getElementById("tela-inicial"),
  nome: document.getElementById("tela-nome"),
  data: document.getElementById("tela-data"),
  atributos: document.getElementById("tela-atributos"),
  final: document.getElementById("tela-final")
};

function trocarTela(atual, proxima){
  telas[atual].classList.remove("ativa");
  telas[proxima].classList.add("ativa");
}

document.getElementById("btn-comecar").onclick = () => trocarTela("inicial","nome");

const nomes = ["Arkan","Lunaris","Kael","Nyx","Theron","Eldric","Mira","Valkor","Zarek","Lyra"];
const inputNome = document.getElementById("nome-input");
const sugestoes = document.getElementById("sugestoes");
let nomeJogador = "";

inputNome.addEventListener("input",()=>{
  const valor = inputNome.value.toLowerCase();
  sugestoes.innerHTML="";
  if(!valor) return;
  nomes.filter(n=>n.toLowerCase().startsWith(valor)).forEach(n=>{
    const li=document.createElement("li");
    li.textContent=n;
    li.onclick=()=>{inputNome.value=n;sugestoes.innerHTML="";};
    sugestoes.appendChild(li);
  });
});

document.getElementById("ok-nome").onclick=()=>{
  if(inputNome.value.trim()==="") return;
  nomeJogador = inputNome.value;
  trocarTela("nome","data");
};

document.getElementById("ok-data").onclick=()=>{
  const dia=Number(document.getElementById("dia").value);
  const mes=Number(document.getElementById("mes").value);
  const ano=Number(document.getElementById("ano").value);
  const erro=document.getElementById("erro-data");

  if(mes<1||mes>12||ano>2016||ano<1900){ erro.textContent="Data inválida"; return; }

  const diasMes=[31,(ano%4===0?29:28),31,30,31,30,31,31,30,31,30,31];
  if(dia<1||dia>diasMes[mes-1]){ erro.textContent="Data inválida"; return; }

  erro.textContent="";
  gerarAtributos();
  trocarTela("data","atributos");
};

let atributos={};
function rolar(){ return Math.floor(Math.random()*5)+1; }

function gerarAtributos(){
  atributos={
    Força:rolar(),
    Inteligência:rolar(),
    Percepção:rolar(),
    Carisma:rolar(),
    Agilidade:rolar()
  };

  const div=document.getElementById("atributos");
  div.innerHTML="";

  Object.entries(atributos).forEach(([nome,valor])=>{
    const linha=document.createElement("div");
    linha.innerHTML=`${nome}: ${valor}
      <div class="barra"><span style="width:${valor*20}%"></span></div>`;
    div.appendChild(linha);
  });
}

document.getElementById("continuar").onclick=()=>{
  mostrarFicha();
  trocarTela("atributos","final");
};

function mostrarFicha(){
  const ficha=document.getElementById("ficha");
  const dia=document.getElementById("dia").value;
  const mes=document.getElementById("mes").value;
  const ano=document.getElementById("ano").value;
  const idade=2016-ano;

  const soma=Object.values(atributos).reduce((a,b)=>a+b,0);

  let raridade="Comum";
  if(soma>=21) raridade="Lendário";
  else if(soma>=16) raridade="Raro";
  else if(soma>=11) raridade="Incomum";

  const maior = Object.entries(atributos).sort((a,b)=>b[1]-a[1])[0][0];
  let classe="Explorador";
  if(maior==="Força") classe="Combatente";
  if(maior==="Inteligência") classe="Estrategista";
  if(maior==="Agilidade") classe="Explorador";

  ficha.innerHTML=`
    <h2>Ficha de RPG</h2>
    <p><strong>Título:</strong> Aventureiro Iniciante</p>
    <p><strong>Nome:</strong> ${nomeJogador}</p>
    <p><strong>Idade:</strong> ${idade}</p>
    <p><strong>Data:</strong> ${dia}/${mes}/${ano}</p>
    <p><strong>Classe:</strong> ${classe}</p>
    <p><strong>Raridade:</strong> ${raridade}</p>
    <hr>
    ${Object.entries(atributos).map(([n,v])=>`
      <p>${n}: ${v}</p>
      <div class="barra"><span style="width:${v*20}%"></span></div>
    `).join("")}
  `;
}
