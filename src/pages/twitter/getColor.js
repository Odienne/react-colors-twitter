export const getPrimaryColor = () => {
    let colors = localStorage.getItem('colors') ? JSON.parse(localStorage.getItem('colors')) : [];
    let color = colors.find(col => col.primary);


    if (!color) return "#ffc996";

    return color.hex.value;
};

export const getSecondaryColor = () => {
    let colors = localStorage.getItem('colors') ? JSON.parse(localStorage.getItem('colors')) : [];
    let color = colors.find(col => col.secondary);

    if (!color) return "coral";

    return color.hex.value;
};