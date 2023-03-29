import Experience from "./Experience/Experience.js";
import Loader from "./Experience/Utils/Loader.js";
import Assets from './Experience/Assets.js';

const loadingScreen = document.querySelector('.loading-screen');
const loader = document.querySelector('.loader');
const enterExperienceBtn = document.querySelector('.start-btn');
const sectionsContainer = document.querySelector('.sections');

const assetLoader = new Loader()

assetLoader.LoadAll(Assets, res => {
    for (let i = 0; i < res.length; i++)
        Assets[i].data = res[i];

    loader.classList.add('hidden');
    enterExperienceBtn.classList.remove('hidden');
});

enterExperienceBtn.addEventListener('click', () => {
    loadingScreen.classList.add('hidden');
    sectionsContainer.classList.remove('hidden');
    
    const experience = new Experience({
        targetElement: document.querySelector('.experience') 
    });
});