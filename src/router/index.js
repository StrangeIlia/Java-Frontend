import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Page_Home.vue'
import ContextPage from "../views/Page_ContextPage";
import FavoriteVideos from "../views/Page_FavoriteVideos";
import UserPage from "../views/Rage_UserPage";
import Page_DeleteVideo from "../views/Page_DeleteVideo";
import Page_UpdateVideo from "../views/Page_UpdateVideo";
import Page_Playlist from "../views/Page_Playlist";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/video/:id',
    name: 'video',
    props: true,
    component: ContextPage,
  },
  {
    path: "/favorite_videos",
    name: 'favorite_videos',
    component: FavoriteVideos
  },
  {
    path: '/user_page/:username',
    name: 'user_page',
    component: UserPage
  },
  {
    path: '/update_video',
    name: 'update_video',
    component: Page_UpdateVideo
  },
  {
    path: '/delete_video',
    name: 'delete_video',
    component: Page_DeleteVideo
  },
  {
    path: '/playlists/:playlistId',
    name: 'playlists',
    component: Page_Playlist
  }
];

const router = new VueRouter({
  routes
});

export default router
