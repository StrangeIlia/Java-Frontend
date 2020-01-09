<template>
    <div>
        <h1 class="m-auto text-center">Это плейлист пользователя {{playlist.name}}</h1>
        <h1 class="m-auto text-center">Создатель этого плейлиста:
            <router-link  :to="{name: 'user_page', params:{username:playlist.author}}">{{playlist.author}}</router-link>
        </h1>
        <div class="album py-5">
            <div class="container">
                <div class="row">
                    <div v-for="video in videos" :key="video.id" class="col-md-3">
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
</template>

<script>
    import { HTTP } from "../components/http";
    export default {
        name: 'Videos',
        data () {
            return{
                playlist: {
                    author: "",
                    name: "",
                },
                videos: [],
            }
        },

        created() {
            HTTP.get('playlists/view?=' + this.playlistId).then(response => this.playlist = response.data )
            HTTP.get('playlists/videos?=' + this.playlistId).then(response => this.videos = response.data );
        },

        computed: {
            playlistId : function () {
                return this.$root.$route.params.playlistId;
            }
        }
    }

</script>