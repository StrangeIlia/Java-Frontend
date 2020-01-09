<template>
    <div>
        <h1 class="m-auto text-center">Это страница пользователя {{username}}</h1>
        <div class="album py-5" style="display: flex; flex-direction: column; align-items: center;">
            <ul class="nav nav-tabs">
                <li class="active"><a data-toggle="tab" href="#panel1">Понравившееся видео</a></li>
                <li><a data-toggle="tab" href="#panel2">Добавленные видео</a></li>
                <li class="dropdown">
                    <a data-toggle="dropdown" class="dropdown-toggle" href="#">
                        Другие панели
                        <b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a data-toggle="tab" href="#panel3">Панель 3</a></li>
                        <li><a data-toggle="tab" href="#panel4">Панель 4</a></li>
                    </ul>
                </li>
            </ul>

            <div class="tab-content">
                <div id="panel1" class="tab-pane fade in active">
                    <div class="album py-5">
                        <div class="container">
                            <div class="row">
                                <div v-for="video in favorite_video" :key="video.id" class="col-md-3">
                                    <router-link :to="{name:'video', params:{id:video.id} }">
                                        <div class="card mb-4 shadow-sm">
                                            <img :src="video.preview" alt = "Невозможно" width="100%" height="100%">
                                            <div class = "card-body">
                                                <div class="card-text">
                                                    {{video.name}}
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="panel2" class="tab-pane fade">
                    <div class="album py-5">
                        <div class="container">
                            <div class="row">
                                <div v-for="video in loaded_video" :key="video.id" class="col-md-3">
                                    <router-link :to="{name:'video', params:{id:video.id} }">
                                        <div class="card mb-4 shadow-sm">
                                            <img :src="video.preview" alt = "Невозможно" width="100%" height="100%">
                                            <div class = "card-body">
                                                <div class="card-text">
                                                    {{video.name}}
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="panel3" class="tab-pane fade">
                    <h3>Панель 3</h3>
                    <p>Содержимое 3 панели...</p>
                </div>
                <div id="panel4" class="tab-pane fade">
                    <h3>Панель 4</h3>
                    <p>Содержимое 4 панели...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {HTTP} from "../components/http";

    export default {
        name: "UserPage",

        data() {
            return {
                loaded_video: [],
                favorite_video: [],
                playlists: [],
            }
        },

        created() {
            HTTP.get("users/loaded_video?username=" + this.username)
                .then( response => this.loaded_video = response.data )
            HTTP.get("users/favorite_video?username=" + this.username)
                .then( response => this.favorite_video = response.data )
        },

        computed: {
            username : function () {
                return this.$root.$route.params.username;
            }
        },
    }
</script>