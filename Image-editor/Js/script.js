//selecionando o input de img do html padrao
const fileInput = window.document.querySelector(".file-input");
//selecionando o button choose-img do html
const chooseImgBtn = window.document.querySelector(".choose-img");
//selecionado a parte da imagem no html
const previewIMG = window.document.querySelector(".preview-img img");
//selecionando todos os button do html, para mudar o background quando for selecionado um button diferente
const filterOptions = window.document.querySelectorAll(".filter button");
//selecionando o filter name, fazendo com que posso mudar de acordo com o filter selecionando
const filterName = window.document.querySelector(".filter-info .name");
//selecionadno o filter slider, para mudar caso a barra de slider mude,tem q mudar o numero no html tbm.
const filterSlider = window.document.querySelector(".slider input");
//selecionando o numero do html, que vai mudar, como citado acima
const filterValue = window.document.querySelector(".filter-info .value");
//selecionando todos os buttons que fazem as funcoes secundarias
const rotateOptions = window.document.querySelectorAll(".rotate button");
//selecionando o button de reset
const resetFilterBtn = window.document.querySelector(".reset-filter");
//selecionando o button de savem img
const saveImgBtn = window.document.querySelector(".save-img")

//declarando as variaveis iniciais dos filtros
let brilho = 100, saturação = 100, inversao = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1,flipVertical = 1;

const applyFilters = () => {
    previewIMG.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    //o style é aplicado diretamente no html, com isso podemos colocar qualquer filtro disponivel
    previewIMG.style.filter = `brightness(${brilho}%) saturate(${saturação}%) invert(${inversao}%) grayscale(${grayscale}%)`
};

const loadImage = () => {
    let file = fileInput.files[0]; //pegando o file escolhido pelo usuario, com isso tenho todas os metadados da imagem
    if(!file) return; //caso o usuario não selecione nada

    //passando para o meu .preview-img div o arquivo que o usuario escolheu
    previewIMG.src = URL.createObjectURL(file);

    previewIMG.addEventListener("load", () => {
        resetFilterBtn.click(); //reseta os filtros toda vez que seleciona uma nova imagem 
        document.querySelector(".container").classList.remove("disable");
    })
};

//mudando a classe active para o button selecionado e removendo do anterior
filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;    

        //definindo os valores individualmetne, pois antes tava se brilho == 100 entao saturação == 100, agora definismos um pra cada, alem de difinir os limites dos filtros;
        if(option.id === "Brilho"){
            filterSlider.max = "200";
            filterSlider.value = brilho;
            filterValue.innerText = `${brilho}%`;
        }else if(option.id === "Saturação"){
            filterSlider.max = "200";
            filterSlider.value = saturação;
            filterValue.innerText = `${saturação}%`;
        }else if(option.id === "Inversão"){
            filterSlider.max = "100";
            filterSlider.value = inversao;
            filterValue.innerText = `${inversao}%`;
        }else if(option.id === "GrayScale"){
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    })
})



//update no text do numero slider
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "Brilho"){
        brilho = filterSlider.value;
    }else if(selectedFilter.id === "Saturação"){
        saturação = filterSlider.value;
    }else if(selectedFilter.id === "Inversão"){
        inversao = filterSlider.value;
    }else if(selectedFilter.id === "GrayScale"){
        grayscale = filterSlider.value;
    }
    //no final eu chamo outra função;
    applyFilters();
}

//selecioandno todos os buttons e vendo qual foi cliclado, assim para adiconar a classe active para o selecionado e remover do anterior
rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if(option.id === "left") {
            rotate -= 90;  //decrementamos -90 para rotacionar a imagem a esquerda
        } else if(option.id === "right") {
            rotate += 90; //incrementamos +90 para rotacionar a imagem a direita
        } else if(option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1; //se o fliphorinzontal for igual a 1, ele seta o valor pra -1, se não ele seta pra 1 
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1; //se o flipVertical for igual a 1, ele seta o valor pra -1, se não ele seta pra 1 
        }
        applyFilters();
    });
});

const resetFilter = () => {
    //reseta todas as variaveis para o valor padrao
    brilho = 100; saturação = 100; inversao = 0; grayscale = 0; rotate = 0; flipHorizontal = 1; flipVertical = 1;
    filterOptions[0].click(); //é como se a gente tivesse clickado no btn do brilho, fazendo com que carregue tudo, com as variaveis resetadas
    applyFilters();
};

const SaveIMG = () => {
    const canvas = document.createElement("canvas"); //creando o elemento canvas
    const ctx = canvas.getContext("2d");  //canvas.getContext return o desenho no context atuais da foto
    canvas.width = previewIMG.naturalWidth; //setando o tamanho horizontal do canvas de acordo com a foto preview
    canvas.height = previewIMG.naturalHeight;  //setando o tamanho vertical do canvas de acordo com a foto preview

    //filtros escolhidos pelo usuarios
    ctx.filter = `brightness(${brilho}%) saturate(${saturação}%) invert(${inversao}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //colocando o canvas no centro
    if(rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical); //flip canvas horinzontal/vertical, pois isso não é propriedades, então é feita em funcao 
    

    /*isso apenas gera a foto, de acordo com a orignal, logo, está tudo sem os filtros, então a gente usa .filter e .scale no getcontext e colocamos os filtros escolhidos pelo usuario*/
    ctx.drawImage(previewIMG, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    //document.body.appendChild(canvas); //mostrando a foto gerada
    const link = document.createElement("a"); //criando a tag <a>
    link.download = "imagem.jpg"; //passando a tag <a> download value "imagem.jpg"
    link.href = canvas.toDataURL(); //passando a href da tag <a> o link da url do canvas
    link.click(); //adicionando um movimento de click no link;
};

//adicionando o eventlistener no button e chamando a funcao caso seja clicado
saveImgBtn.addEventListener("click", SaveIMG)

//caso eu tenha alguma mudança no btn do reset ele chama a funcao reset
resetFilterBtn.addEventListener("click", resetFilter);

//se tiver alguma mudança na file-input ele chama a função loadImage.
fileInput.addEventListener("change", loadImage);

//caso eu mude o slider, ele chama a funcao de update
filterSlider.addEventListener("input", updateFilter);

//fazendo com q o choose-img, seja um button cliclavel e que ele apareça a funcao de file-input, ele ja vem nativo do navegador
chooseImgBtn.addEventListener("click", () => fileInput.click());

