document.addEventListener('DOMContentLoaded', () => {
    const btnPreIpo = document.getElementById('btn-preIpo');
    const btnOfs = document.getElementById('btn-ofs');
    const imgPreIpo = document.getElementById('img-preIpo');
    const imgOfs = document.getElementById('img-ofs');
    const wrapper = document.querySelector('.toggle-wrapper');

    // Verification check
    if (!btnPreIpo || !btnOfs) {
        console.error("Buttons not found! Check if IDs in HTML match the Script.");
        return;
    }

    function switchView(view) {
        console.log("Switching to:", view); // This will tell us if the click works

        if (view === 'preIpo') {
            btnPreIpo.classList.add('active');
            btnOfs.classList.remove('active');
            wrapper.classList.remove('right-active');

            imgPreIpo.classList.add('active');
            imgOfs.classList.remove('active');
        } else {
            btnOfs.classList.add('active');
            btnPreIpo.classList.remove('active');
            wrapper.classList.add('right-active');

            imgOfs.classList.add('active');
            imgPreIpo.classList.remove('active');
        }
    }

    btnPreIpo.onclick = () => switchView('preIpo');
    btnOfs.onclick = () => switchView('ofs');
});
