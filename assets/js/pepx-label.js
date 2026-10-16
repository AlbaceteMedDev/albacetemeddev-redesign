/* Peptide labels (pepx-label.css): a label waits for its photograph, so no name floats on the grey slot while a lazy
   image is still loading (or if it fails). Without JS the labels simply show; the markup is complete either way. */
(function () {
  var frames = document.querySelectorAll('.pl-frame');
  for (var i = 0; i < frames.length; i++) (function (f) {
    var img = f.querySelector('img');
    if (!img || (img.complete && img.naturalWidth)) return;
    f.classList.add('pl-wait');
    img.addEventListener('load', function () { f.classList.remove('pl-wait'); }, { once: true });
  })(frames[i]);
})();
