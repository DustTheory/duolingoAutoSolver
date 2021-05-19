// ==UserScript==
// @name        Duolinog autoSolver
// @namespace   Violentmonkey Scripts
// @match       https://www.duolingo.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/21/2020, 6:35:07 PM
// ==/UserScript==
 
function addButtons(time){
 
    setTimeout(()=>{
      let original = document.querySelectorAll('[data-test="player-next"]')[0];
      let wrapper = document.getElementsByClassName('_10vOG')[0];
      
      wrapper.style.display = "flex"
   
      let solveCopy = document.createElement('button');
      let pauseCopy = document.createElement('button');
   
      solveCopy.innerHTML = 'SOLVE ALL';
      solveCopy.disabled = false;
      pauseCopy.innerHTML = 'SOLVE';
      
      const buttonStyle = `
          min-width: 150px;
          font-size: 17px;
          border:none;
          border-bottom: 4px solid #58a700;
          border-radius: 18px;
          padding: 13px 16px;
          transform: translateZ(0);
          transition: filter .2s;
          font-weight: 700;
          letter-spacing: .8px;
          background: #55CD2E;
          color:#fff;
          margin-left:20px;
          cursor:pointer;
         `
      
      solveCopy.style.cssText = buttonStyle
      pauseCopy.style.cssText = buttonStyle
      
      //Hover effect for buttons
      
      function mouseOver(x){
        x.style.filter = "brightness(1.1)"
      }
      
      function mouseLeave(x){
        x.style.filter = "none"
      }
      
      let buttons = [solveCopy,pauseCopy]
      
      buttons.forEach(button => {
        button.addEventListener("mousemove", () => {
        mouseOver(button)
        })
      })
      
      buttons.forEach(button => {
        button.addEventListener("mouseleave", () => {
        mouseLeave(button)
        })
      })
      
  
         
      original.parentElement.appendChild(pauseCopy);
      original.parentElement.appendChild(solveCopy);
      
   
      solveCopy.addEventListener('click', startSolving);
      pauseCopy.addEventListener('click', solve);
    }, time || 1000);
   
  }
   
  addButtons(2300);
   
   
  var intervalId;
   
  function startSolving(){
    if(intervalId)
      return;
    intervalId = setInterval(solve, 500);
  }
   
  function pauseSolving(){
    if(!intervalId)
      return;
    clearInterval(intervalId);
    intervalId = undefined;
  }
   
  function solve() {
        window.sol = FindReact(document.getElementsByClassName('_3FiYg')[0]).props.currentChallenge
    if(!window.sol)
          return;
      let btn = null;
   
      let selNext     = document.querySelectorAll('[data-test="player-next"]');
      let selAgain    = document.getElementsByClassName('_3_pD1 _2ESN4 _2arQ0 _2vmUZ _2Zh2S _1X3l0 eJd0I _3yrdh _2wXoR _1AM95 _1dlWz _2gnHr _2L5kw _3Ry1f')
   
      if ( selAgain.length === 1 ) {
          // Make sure it's the `practice again` button
          if( selAgain[0].innerHTML.toLowerCase() === 'practice again' ) {
              // Click the `practice again` button
              selAgain[0].click();
   
              // Terminate
              return;
          }
      }
   
      if( selNext.length === 1 ) {
          // Save the button element
          btn = selNext[0];
   
          if( document.querySelectorAll('[data-test="challenge-choice"]').length > 0 ) {
              if(sol.correctIndices){
                window.sol.correctIndices.forEach( index => {
                  document.querySelectorAll('[data-test="challenge-choice"]')[index].children[0].click()
                })
              // Click the first element
              }else{
                 document.querySelectorAll('[data-test="challenge-choice"]')[window.sol.correctIndex].click()
              }
              // Click the solve button
              btn.click();
          }
   
         if( document.querySelectorAll('[data-test="challenge-choice-card"]').length > 0 ) {
              // Click the first element
              if(sol.correctIndices){
                window.sol.correctIndices.forEach( index => {
                  document.querySelectorAll('[data-test="challenge-choice-card"]')[index].children[0].click()
                })
              }else{
                 document.querySelectorAll('[data-test="challenge-choice-card"]')[window.sol.correctIndex].click()
              }
              // Click the solve button
              btn.click();
          }
   
          if( document.querySelectorAll('[data-test="challenge-tap-token"]').length > 0 ) {
              // Click the first element
            clicked = {}
              window.sol.correctIndices.forEach(index => {
                let correctAnswer = window.sol.choices[index].text;
                let nl =  document.querySelectorAll('[data-test="challenge-tap-token"]');
                for(let i = 0; i < nl.length; i++){
                  if( (nl[i].innerText).toLowerCase().trim() == correctAnswer.toLowerCase().trim() && !nl[i].disabled){
                    clicked[i] = 1;
                    nl[i].click();
                    break;
                  }
                }
              });
              // Click the solve button
              btn.click();
          }
   
          if( document.querySelectorAll('[data-test="challenge-text-input"]').length > 0 ) {
   
              let elm = document.querySelectorAll('[data-test="challenge-text-input"]')[0]
              let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
              nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);
   
              let inputEvent = new Event('input', { bubbles: true});
   
              elm.dispatchEvent(inputEvent);
          }
   
          if( document.getElementsByTagName('textarea').length > 0 ) {
              let elm = document.getElementsByTagName('textarea')[0]
   
              let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
              nativeInputValueSetter.call(elm, window.sol.correctSolutions ? window.sol.correctSolutions[0] : window.sol.prompt);
   
              let inputEvent = new Event('input', { bubbles: true});
   
              elm.dispatchEvent(inputEvent);
          }
   
          // Continue
          btn.click();
      } 
  }
   
  function FindReact(dom, traverseUp = 0) {
      const key = Object.keys(dom.parentElement).find(key=>key.startsWith("__reactProps$"));
      return dom.parentElement[key].children[0]._owner.stateNode;
      /*
      const key = Object.keys(dom).find(key=>key.startsWith("__reactInternalInstance$"));
      const domFiber = dom[key];
      if (domFiber == null) return null;
   
      // react <16
      if (domFiber._currentElement) {
          let compFiber = domFiber._currentElement._owner;
          for (let i = 0; i < traverseUp; i++) {
              compFiber = compFiber._currentElement._owner;
          }
          return compFiber._instance;
      }
   
      // react 16+
      const GetCompFiber = fiber=>{
          //return fiber._debugOwner; // this also works, but is __DEV__ only
          let parentFiber = fiber.return;
          while (typeof parentFiber.type == "string") {
              parentFiber = parentFiber.return;
          }
          return parentFiber;
      };
      let compFiber = GetCompFiber(domFiber);
      for (let i = 0; i < traverseUp; i++) {
          compFiber = GetCompFiber(compFiber);
      }
      return compFiber.stateNode; */
  }
   
  window.findReact = FindReact;
   
  window.ss = startSolving;