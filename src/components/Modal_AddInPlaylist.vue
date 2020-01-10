<template>
    <transition name="modal_addNewVideo">
        <form>
            <div class="modal-mask" v-if="result === ''">
                <div class="modal-wrapper">
                    <div class="modal-container">
                        <div class="modal-body">
                            <slot name="body">
                                <div class="custom-control custom-radio">
                                    <input type="radio" class="custom-control-input" id="defaultGroupExample1"
                                           name="groupOfDefaultRadios" checked
                                           @click="selectPlaylist = true"
                                    >
                                    <label class="custom-control-label" for="defaultGroupExample1">Выбрать
                                        плейлист</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input type="radio" class="custom-control-input"
                                           id="defaultGroupExample2"
                                           name="groupOfDefaultRadios"
                                           @click="selectPlaylist = false"
                                    >
                                    <label class="custom-control-label" for="defaultGroupExample2">Создать новый
                                        плейлист</label>
                                </div>

                                <div class="tab-content">
                                    <div id="panel1" class="tab-pane fade" v-bind:class="{'in active': selectPlaylist}">
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
                                    <div id="panel2" class="tab-pane fade"
                                         v-bind:class="{'in active': !selectPlaylist}">
                                        <div class="col">
                                            <label for="groupPlaylistName">Введите название плейлиста</label>
                                            <input type="text" id="groupPlaylistName" v-model="playlistName"/>
                                        </div>
                                    </div>
                                </div>
                            </slot>
                        </div>

                        <div class="modal-footer">
                            <slot name="footer">
                                <button class="modal-default-button" @click="selector">
                                    Добавление видео
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
        </form>
    </transition>
</template>

<script>
    import {HTTP} from "./http";

    export default {
        name: "Modal_AddInPlaylist",
        props: ['videoId'],

        data() {
            return {
                playlists: [],
                selectedPlaylist: null,
                playlistName: "",
                result: "",
                selectPlaylist: true,
                currentPlaylistName: ""
            }
        },

        created() {
            this.createForm();
        },

        methods: {
            createForm: function () {
                if (this.username !== null && this.username !== '') {
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

            selector: function () {
                if (!this.selectPlaylist)
                    this.addPlaylist();
                else
                    this.addVideo();
            },

            addPlaylist: function () {
                HTTP.post("playlists/create", {
                    name: this.playlistName
                }).then(
                    response => {
                        if (response.data.status === 'success') {
                            this.selectedPlaylist = response.data.playlist;
                            this.addVideo();
                        } else this.result = response.data.error;
                    }
                ).catch();
            },
            addVideo: function () {
                if (this.selectedPlaylist.id === undefined) return;
                HTTP.post("playlists/add_video?videoId=" + this.videoId +
                    "&playlistId=" + this.selectedPlaylist.id).then(
                    response => {
                        if (response.data.status === 'success') {
                            this.result = 'Видео успешно добавлено в плейлист';
                        } else this.result = response.data.error;
                    }
                ).catch(() => this.result = 'Сервер не отвечает');
            },
            close: function () {
                this.$emit('close');
            },
        },
        computed: {
            username: function () {
                return this.$root.username;
            }
        },
        watch: {
            selectedPlaylist: function (val) {
                this.currentPlaylistName = val.name;
            }
        }
    }
</script>