import {defineConfig} from "umi";

export default defineConfig({
    plugins: [
        '@umijs/plugins/dist/initial-state',
        '@umijs/plugins/dist/model',
    ],
    model: {},
    favicons: [],
    routes: [
        {path: "/", component: "login", layout: false},
        {path: "/index", component: "index", layout: false},
        {path: "/register", component: "register", layout: false},
        {path: "/archives", component: "archives"},
        {path: "/user", component: "user"},
        {path: "/web", component: "web"},
        {path: "/recycleBin", component: "recycleBin"},
        {path: "/article", component: "article", layout: false},

    ],
    npmClient: 'yarn',
});
