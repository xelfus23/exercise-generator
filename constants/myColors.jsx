const MyColors = (opacity) => ({
    black: `rgba(36, 36, 36, ${opacity})`,
    gray: `rgba(63, 66, 70, ${opacity})`,
    lightcyan: `rgba(169, 206, 194, ${opacity})`,
    white: `rgba(242, 236, 255, ${opacity})`,
    green: `rgba(0, 200, 150, ${opacity})`,
    red: `rgba(230, 72, 72, ${opacity})`,
    purple: `rgba(134, 133, 239, ${opacity})`,
    yellow: `rgba(209, 163, 56, ${opacity})`,
    blue: `rgba(24, 44, 174, ${opacity})`,
    gold: `rgba(250, 215, 0, ${opacity})`,
});

const DiscretePalette = {
    black: "#252525",
    purple: "#8685ef",
    white: "#faf8ff",
    green: "#d3fbd8",
};

export { MyColors, DiscretePalette };
