<template>
    <transition name="modal_playlistManager">
        <div>
            <div class="modal-mask" v-if="result === ''">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-body">
                            <slot name="body">
                                <div class="form-check">
                                    <label class="form-check-label" for="exampleCheck1">Удалить плейлист</label>
                                    <input type="checkbox" class="form-check-input" id="exampleCheck1"
                                           v-model="selectPlaylist">
                                </div>

                                <!-- Меню выбора плейлиста -->
                                <div class="tab-content">
                                    <div class="tab-pane fade in active">
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-info dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            >
                                                {{currentPlaylistName}}
                                            </button>
                                            <div class="dropdown-menu">
                                                <div v-for="playlist in playlists" :key="playlist.id">
                                                    <a class="dropdown-item" @click="changeSelectedPlaylist(playlist)">{{playlist.name}}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Меню выбора видео -->
                                <div class="tab-content">
                                    <div class="tab-pane fade" v-bind:class="{'in active': videoLoaded}">
                                        <div class="btn-group">
                                            <button type="button" class="btn btn-info dropdown-toggle"
                                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            >
                                                {{currentVideoName}}
                                            </button>
                                            <div class="dropdown-menu">
                                                <div v-for="video in videos" :key="video.id">
                                                    <a class="dropdown-item" @click="changeSelectedVideo(video)">{{video.name}}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </slot>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                                <button type="submit" class="modal-default-button" @click="selector">
                                    Удалить
                                </button>
                                <button class="modal-default-button" @click="close">
                                    Отмена
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-mask" v-else>
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-body">
                            {{result}}
                        </div>
                        <div class="modal-footer">
                            <slot name="footer">
                                <button class="modal-default-button" @click="close">
                                    Выход
                                </button>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {HTTP} from "./http";

    export default {
        name: "Modal_PlaylistManager",

        data() {
            return {
                playlists: [],
                selectedPlaylist: null,
                result: "",
                selectPlaylist: true,
                currentPlaylistName: "",
                videos: [],
                selectedVideo: null,
                currentVideoName: ""
            }
        },

        created() {
            this.createForm();
        },

        methods: {
            createForm: function () {
                if (this.username !== null && this.username !== '') {
                    this.result = "";

                    this.selectedPlaylist = {
                        name: 'Выберите плейлист'
                    };

                    HTTP.get("users/playlists?username=" + this.username).then(
                        response => {
                            this.playlists = response.data;
                            this.playlists.unshift(this.selectedPlaylist);
                        }
                    ).catch();
                }
            },

            changeSelectedPlaylist: function (playlists) {
                this.selectedPlaylist = playlists;
            },

            changeSelectedVideo: function (video) {
                this.selectedVideo = video;
            },

            selector: function () {
                if (this.selectPlaylist)
                    this.deletePlaylist();
                else
                    this.removeVideoFromPlaylist();
            },

            deletePlaylist: function () {
                if (this.selectedPlaylist.id === undefined) {
                    this.result = 'Вы не выбрали плейлист';
                    return;
                }

                HTTP.delete("playlists/delete?id=" + this.selectedPlaylist.id)
                    .then(() => this.result = 'Плейлист успешно удален')
                    .catch(() => this.result = 'Ошибка при удалении плейлиста')
            },

            removeVideoFromPlaylist: function () {
                if (this.selectedPlaylist.id === undefined) {
                    this.result = 'Вы не выбрали плейлист';
                    return;
                }

                if (this.selectedVideo.id === undefined) {
                    this.result = 'Вы не выбрали видео';
                    return;
                }

                HTTP.delete("playlists/delete_video?playlistId=" + this.selectedPlaylist.id +
                    "&videoId=" + this.selectedVideo.id)
                    .then(() => this.result = 'Видео успешно удалено из плейлиста')
                    .catch(() => this.result = 'Ошибка при удалении видео')
            },

            close: function () {
                this.$emit('close');
            },

            loadVideos: function () {
                if (this.selectedPlaylist.id !== undefined) {
                    this.selectedVideo = {
                        name: 'Выберите видео'
                    };
                    HTTP.get("playlists/videos?id=" + this.selectedPlaylist.id)
                        .then(response => {
                            this.videos = response.data;
                            this.videos.unshift(this.selectedVideo);
                        });
                }
            }
        },
        computed: {
            username: function () {
                return this.$root.username;
            },
            videoLoaded: function () {
                return this.videos.length !== 0 && !this.selectPlaylist;
            }
        },
        watch: {
            selectedPlaylist: function (val) {
                this.currentPlaylistName = val.name;
                if (!this.selectPlaylist)
                    this.loadVideos();
            },
            selectedVideo: function (val) {
                this.currentVideoName = val.name;
            },
            selectPlaylist: function (val) {
                let tmp = val;
                val = tmp;
                this.loadVideos();
            }
        }
    }
</script>

