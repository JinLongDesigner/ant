;(function($) {
    var input_style = 'style="width: 90%;"';
    
    var html_header = '<div id="setting_about" style="font-size: 16px;">' +
            '    <div>' +
            '       <h3 style="padding: 9px 0;" class="text-success">安装确认</h3>' +
            '        <p style="line-height:24px;">下面是你安装配置信息, 请确认无误后, 点击上方「确定并提交」按钮</p><hr>';
    var html_install_info = {};
    var html_footer = '    </div>' +
            '</div>';

    var noxss = function (str) {
        return str.replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;");
    };

    var install_keys = ['create_admin'];

    var ADDON = {
        ui: {
            welcome: {
                parent_step: '',
                next_step: 'create_admin',
                name: 'welcome',
                header: 'Ant 安装向导',
                formHTML: '<div id="setting_about" style="font-size: 16px;">' +
                        '   <div>' +
                        '       <p style="line-height:24px;">欢迎使用 Ant, 接下来我们将引导您进行初步设置</p>' +
                        '       <p style="line-height:24px;">您在使用本平台之前, 请务必仔细阅读以下条款。</p>' +
                        '       <p style="line-height:24px;">您在使用本平台时, 默认您已知晓并同意以下条款。</p>' +
                        '       <h3 style="padding: 5px 0;" class="text-danger">免责声明</h3>' +
                        '           <p style="line-height:24px;">本站仅提供一个学习与交流的平台，请勿用于其他非法用途，请自行承担由此带来的风险。</p>' +
                        '           <p style="line-height:24px;">本软件按「原样」提供，不提供任何形式的保证，或者暗示，包括但不限于适销性保证，适用于特定用途和不侵权的适用性。</p>' +
                        '           <p style="line-height:24px;">在任何情况下都不应该作者或版权所有者对任何索赔，损害或其他责任均有责任无论是合同，侵权行为还是其他行为，由此产生的责任，超出或与本软件或其中的使用或其他交易有关的软件。</p>' +
                        '       <h3 style="padding: 5px 0;" class="text-info">联系我们</h3>' +
                        '           <p style="line-height:24px;">在线交流: <a target="_blank" href="https://discord.gg/Uzh5nUf">https://discord.gg/Uzh5nUf</a><br>GitHub: <a href="http://github.com/antswordproject/ant" target="_blank">http://github.com/antswordproject/ant</a></p>' +
                        '   </div>' +
                        '</div>',
                toolbar: {
                    items: [{
                        type: 'button',
                        caption: '我同意',
                        icon: 'fa fa-step-forward',
                        onClick: function () {
                            var self = w2ui['welcome'];
                            w2ui.sidebar.disable('install_' + self.name)
                            w2ui.sidebar.enable('install_' + self.next_step)
                            w2ui.sidebar.click('install_' + self.next_step)
                        }
                    }, {
                        type: 'break'
                    }]
                }
            },
            create_admin: {
                parent_step: 'welcome',
                next_step: 'submit_form',
                name: 'create_admin',
                header: '创建管理员',
                fields: [{
                    type: 'email',
                    field: 'email',
                    required: true,
                    html: {
                        caption: '邮箱',
                        attr: input_style
                    }
                }, {
                    type: 'text',
                    field: 'nickname',
                    required: true,
                    html: {
                        caption: '昵称',
                        attr: input_style
                    }
                }, {
                    type: 'password',
                    field: 'password',
                    required: true,
                    html: {
                        caption: '密码',
                        attr: input_style
                    }
                }, {
                    type: 'password',
                    field: 'password1',
                    required: true,
                    html: {
                        caption: '重复密码',
                        attr: input_style
                    }
                }],
                record: JSON.parse(localStorage.getItem('create_admin')) || {},
                toolbar: {
                    items: [{
                        type: 'button',
                        caption: '上一步',
                        icon: 'fa fa-step-backward',
                        onClick: function () {
                            var self = w2ui['create_admin'];
                            w2ui.sidebar.disable('install_' + self.name)
                            w2ui.sidebar.enable('install_' + self.parent_step)
                            w2ui.sidebar.click('install_' + self.parent_step)
                        }
                    }, {
                        type: 'button',
                        caption: '下一步',
                        icon: 'fa fa-step-forward',
                        onClick: function () {
                            var self = w2ui['create_admin'];
                            if (self.validate().length === 0) {
                                if (self.record.password.length < 6) {
                                    $('#password').val('').focus();
                                    return ADDON.warning('密码长度不得少于6位!');
                                }
                                if (self.record.password !== self.record.password1) {
                                    $("#password1").val('').focus();
                                    return ADDON.warning('两次输入的密码不一致!');
                                }
                                var _t_html = '';
                                _t_html += '<h4 style="padding: 5px 0;" class="text-info" style="color:#e24444">管理员</h4>';
                                _t_html += '<p style="margin-left: 20px;line-height:24px;">邮箱: ' + noxss(self.record.email) + '</p>';
                                _t_html += '<p style="margin-left: 20px;line-height:24px;">昵称: ' + noxss(self.record.nickname) + '</p>';
                                html_install_info['create_admin'] = _t_html;
                                w2ui.submit_form.formHTML= '<div class="w2ui-page page-0">' + html_header + (Object.values(html_install_info).join("")) + html_footer + '</div>';
                                w2ui.submit_form.reload();
                                localStorage.setItem('create_admin', JSON.stringify(self.record));
                                w2ui.sidebar.disable('install_' + self.name)
                                w2ui.sidebar.enable('install_' + self.next_step)
                                w2ui.sidebar.click('install_' + self.next_step)
                            };
                        }
                    }, {
                        type: 'break'
                    }]
                }
            },
            submit_form: {
                parent_step: 'create_admin',
                next_step: '',
                name: 'submit_form',
                header: '确认信息',
                formHTML: (
                    html_header + (Object.values(html_install_info).join("")) + html_footer
                ),
                toolbar: {
                    items: [{
                        type: 'button',
                        caption: '上一步',
                        icon: 'fa fa-step-backward',
                        onClick: function () {
                            var self = w2ui['submit_form'];
                            w2ui.sidebar.disable('install_' + self.name)
                            w2ui.sidebar.enable('install_' + self.parent_step)
                            w2ui.sidebar.click('install_' + self.parent_step)
                        }
                    }, {
                        type: 'button',
                        caption: '确定并提交',
                        icon: 'fa fa-save',
                        onClick: function () {
                            var self = w2ui['submit_form'];
                            var post_data = {};
                            install_keys.map(function (key) {
                                var temp = JSON.parse(localStorage.getItem(key)) || {};
                                post_data[key] = temp;
                            });
                            ADDON.lock('安装中..')
                            $.post('/addons/ant.install/install', post_data, function (data) {
                                ADDON.unlock();
                                if (data.ret) {
                                    ADDON.success('安装成功!');
                                    localStorage.setItem('login_user', post_data['create_admin']['email']);
                                    install_keys.map(function (key) { // 移除本地存储
                                        localStorage.removeItem(key);
                                    });
                                    // 重新加载页面
                                    setTimeout(function (){
                                        window.location.href = window.location.origin;
                                    }, 2000);
                                }else{
                                    ADDON.error('安装失败!<br>' + data.err);
                                }
                            })
                        }
                    }]
                }
            }
        },
        init: function () {
            $().w2form(this.ui.welcome);
            $().w2form(this.ui.create_admin);
            $().w2form(this.ui.submit_form);
            ANT.addonLoaded.reg(function () {
                w2ui['sidebar'].click('install_welcome');
            });
        }
    };

    ANT.initAddon({
        id: 'ant_install',
        text: '系统安装',
        group: true,
        expanded: true,
        nodes: [{
            id: 'install_welcome',
            text: '欢迎使用',
            icon: 'fa fa-heart',
            disabled: false,
            onClick: function () {
                ADDON.content(w2ui['welcome']);
            }
        }, {
            id: 'install_create_admin',
            text: '创建管理员',
            icon: 'fa fa-user',
            disabled: true,
            onClick: function () {
                ADDON.content(w2ui['create_admin']);
            }
        }, {
            id: 'install_submit_form',
            text: '确认信息',
            icon: 'fa fa-check',
            disabled: true,
            onClick: function () {
                ADDON.content(w2ui['submit_form']);
            }
        }]
    }, ADDON);

    ANT.addonLoaded.reg(function() {
        ANT.ROUTE.run();
    })
})(jQuery);