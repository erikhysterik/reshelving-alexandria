export const deEntitize = (str) => {
    return str.replace(/&#(\d+);/g, 
    function(match, dec) {
        return String.fromCharCode(dec);
    });
  };