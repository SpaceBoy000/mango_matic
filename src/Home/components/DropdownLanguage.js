import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import Select from 'react-select'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const DropdownLanguage = () => {
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState('en');

    const handleChange = (event) => {
        const lang = event.target.value;
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 180 }} size="small" >
            <InputLabel id="demo-simple-select-autowidth-label">{t("Language")}</InputLabel>
            <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={language}
                onChange={handleChange}
                autoWidth
                label={t("Language")}
                MenuProps={{
                    disableScrollLock: true,
                  }}          
            >
                <MenuItem value={'en'}>{t("English")}</MenuItem>
                <MenuItem value={'jp'}>{t("Japanese")}</MenuItem>
                <MenuItem value={'ko'}>{t("Korean")}</MenuItem>
                <MenuItem value={'zh'}>{t("Chinese")}</MenuItem>
                <MenuItem value={'ru'}>{t("Russian")}</MenuItem>
                <MenuItem value={'fr'}>{t("French")}</MenuItem>
                <MenuItem value={'vi'}>{t("Vietnamese")}</MenuItem>
            </Select>

        </FormControl>
    );
};

export default DropdownLanguage;
