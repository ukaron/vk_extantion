var bkg = chrome.extension.getBackgroundPage();
document.addEventListener('DOMContentLoaded', function () {
  var vkButton = document.getElementById('vk-button');
  vkButton.addEventListener('click', function (e) {
    bkg.OAuth2.begin()
  }, false)

  var checkbox = document.getElementById('checkbox');
  var slider = document.getElementsByClassName('slider')[0];
  bkg.chrome.storage.sync.get(['psycheaExtension'], function(result){
    checkbox.checked = !!result.psycheaExtension;
    if (!slider.classList.contains('animation')) {
      setTimeout(function() {
        slider.classList.add('animation');
      }, 400)
    }
  })
  checkbox.addEventListener('change', function(e) {
    (e.target.checked ? bkg.enable : bkg.disable)();
  });

}, false);
