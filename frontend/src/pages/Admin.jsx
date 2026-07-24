import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


function Admin() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('messages'); // 'projects', 'messages', or 'profile'

    const [projects, setProjects] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
        techStack: '',
        github: '',
        live: '',
        image: '',
        imagePublicId: '',
    });


    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [previewProject, setPreviewProject] = useState(null);

    // Profile image / site settings
    const [settings, setSettings] = useState({
        profileImage: '',
        showProfileImage: false,
        resumeUrl: '',
        resumePublicId: '',
        showFunLink: false,
        githubUsername: '',
        showGithubGraph: false,
        nowText: '',
    });
    const [githubInput, setGithubInput] = useState('');
    const [githubSaved, setGithubSaved] = useState(false);
    const [nowInput, setNowInput] = useState('');
    const [nowSaved, setNowSaved] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [profileUploading, setProfileUploading] = useState(false);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const profileFileInputRef = useRef(null);

    // Resume
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeUploading, setResumeUploading] = useState(false);
    const resumeFileInputRef = useRef(null);

    const fetchProjects = async () => {
        const res = await api.get('/projects');
        setProjects(res.data);
    };

    const fetchMessages = async () => {
        const res = await api.get('/messages');
        setMessages(res.data);
    };

    const fetchSettings = async () => {
        const res = await api.get('/settings');
        setSettings(res.data);
        setGithubInput(res.data.githubUsername || '');
        setNowInput(res.data.nowText || '');
    };

    useEffect(() => {
        fetchProjects();
        fetchMessages();
        fetchSettings();
    }, []);

    const handleProfileImageChange = (e) => {
        setProfileImageFile(e.target.files[0]);
    };

    const handleUploadProfileImage = async () => {
        if (!profileImageFile) return;
        setProfileUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', profileImageFile);
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updated = await api.put('/settings', {
                profileImage: uploadRes.data.url,
                profileImagePublicId: uploadRes.data.publicId,
            });
            setSettings(updated.data);
            setProfileImageFile(null);
            if (profileFileInputRef.current) profileFileInputRef.current.value = '';
        } catch (err) {
            console.error('Profile image upload failed', err);
        }
        setProfileUploading(false);
    };

    const handleRemoveProfileImage = async () => {
        if (!confirm('Remove your profile photo? This deletes it from Cloudinary and clears it here — you\'ll need to re-upload if you want it back.')) return;
        try {
            const updated = await api.delete('/settings/profile-image');
            setSettings(updated.data);
        } catch (err) {
            console.error('Failed to remove profile image', err);
        }
    };

    const handleResumeFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleUploadResume = async () => {
        if (!resumeFile) return;
        setResumeUploading(true);
        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);
            const uploadRes = await api.post('/upload/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updated = await api.put('/settings', {
                resumeUrl: uploadRes.data.url,
                resumePublicId: uploadRes.data.publicId,
            });
            setSettings(updated.data);
            setResumeFile(null);
            if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
        } catch (err) {
            console.error('Resume upload failed', err);
        }
        setResumeUploading(false);
    };

    const handleRemoveResume = async () => {
        if (!confirm('Remove your resume? This deletes it from Cloudinary and the download link will stop working until you upload a new one.')) return;
        try {
            const updated = await api.delete('/settings/resume');
            setSettings(updated.data);
        } catch (err) {
            console.error('Failed to remove resume', err);
        }
    };

    const handleToggleShowImage = async () => {
        try {
            const updated = await api.put('/settings', { showProfileImage: !settings.showProfileImage });
            setSettings(updated.data);
            setSettingsSaved(true);
            setTimeout(() => setSettingsSaved(false), 1500);
        } catch (err) {
            console.error('Failed to update setting', err);
        }
    };

    const handleToggleFunLink = async () => {
        try {
            const updated = await api.put('/settings', { showFunLink: !settings.showFunLink });
            setSettings(updated.data);
        } catch (err) {
            console.error('Failed to update setting', err);
        }
    };

    const handleSaveGithubUsername = async () => {
        try {
            const trimmed = githubInput.trim();
            const payload = { githubUsername: trimmed };
            // If clearing the username, also turn off the graph toggle —
            // otherwise it'd stay "on" with nothing valid to show.
            if (!trimmed) {
                payload.showGithubGraph = false;
            }
            const updated = await api.put('/settings', payload);
            setSettings(updated.data);
            setGithubSaved(true);
            setTimeout(() => setGithubSaved(false), 1500);
        } catch (err) {
            console.error('Failed to save GitHub username', err);
        }
    };

    const handleToggleGithubGraph = async () => {
        try {
            const updated = await api.put('/settings', { showGithubGraph: !settings.showGithubGraph });
            setSettings(updated.data);
        } catch (err) {
            console.error('Failed to update setting', err);
        }
    };

    const handleSaveNowText = async () => {
        try {
            const updated = await api.put('/settings', { nowText: nowInput });
            setSettings(updated.data);
            setNowSaved(true);
            setTimeout(() => setNowSaved(false), 1500);
        } catch (err) {
            console.error('Failed to save now text', err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const resetForm = () => {
        setForm({ title: '', description: '', techStack: '', github: '', live: '', image: '', imagePublicId: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let imageUrl = form.image || '';
        let imagePublicId = form.imagePublicId || '';

        if (imageFile) {
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrl = uploadRes.data.url;
                imagePublicId = uploadRes.data.publicId;
            } catch (err) {
                setError('Image upload failed');
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const payload = {
            ...form,
            image: imageUrl,
            imagePublicId,
            techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        };

        try {
            if (editingId) {
                await api.put(`/projects/${editingId}`, payload);
            } else {
                await api.post('/projects', payload);
            }
            resetForm();
            setImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            techStack: project.techStack.join(', '),
            github: project.github || '',
            live: project.live || '',
            image: project.image || '',
            imagePublicId: project.imagePublicId || '',
        });
        setEditingId(project._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        await api.delete(`/projects/${id}`);
        fetchProjects();
    };

    const handleMarkRead = async (id) => {
        await api.put(`/messages/${id}/read`);
        fetchMessages();
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        await api.delete(`/messages/${id}`);
        fetchMessages();
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    const inputClass =
        "w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition";

    return (
        <div className="bg-[#0D1117] min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-6">
                    <h2
                        className="text-2xl font-bold text-[#E6EDF3]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        Admin Dashboard <span className="text-[#8B949E]">— {user?.name}</span>
                    </h2>
                    <button onClick={logout} className="text-sm text-red-400 hover:underline font-mono">
                        log out
                    </button>
                </div>

                <div className="flex gap-6 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`pb-2 px-1 font-mono text-sm transition ${activeTab === 'projects' ? 'border-b-2 border-[#5CDBD3] text-[#5CDBD3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'
                            }`}
                    >
                        projects
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`pb-2 px-1 font-mono text-sm relative transition ${activeTab === 'messages' ? 'border-b-2 border-[#5CDBD3] text-[#5CDBD3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'
                            }`}
                    >
                        messages {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-2 px-1 font-mono text-sm transition ${activeTab === 'profile' ? 'border-b-2 border-[#5CDBD3] text-[#5CDBD3]' : 'text-[#8B949E] hover:text-[#E6EDF3]'
                            }`}
                    >
                        profile
                    </button>
                </div>

                {activeTab === 'projects' && (
                    <>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="mb-8 flex items-center gap-2 bg-[#5CDBD3] text-[#0D1117] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#4ec4bc] transition"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add Project
                            </button>
                        )}

                        {showForm && (
                        <form onSubmit={handleSubmit} className="bg-[#161B22] border border-white/10 p-6 rounded-xl mb-10 flex flex-col gap-4">
                            <h3 className="text-lg font-semibold text-[#E6EDF3] font-mono">
                                {editingId ? 'edit project' : 'add new project'}
                            </h3>
                            <input
                                name="title"
                                placeholder="Title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />
                            <input
                                name="techStack"
                                placeholder="Tech stack (comma separated: React, Node.js, MongoDB)"
                                value={form.techStack}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <div>
                                <label className="text-sm font-mono text-[#8B949E] mb-2 block">
                                    {editingId ? 'replace image (optional — leave blank to keep current)' : 'project image'}
                                </label>
                                {editingId && form.image && (
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={form.image}
                                            alt="Current project"
                                            className="w-16 h-16 rounded-lg object-cover border border-white/10"
                                        />
                                        <span className="text-xs text-[#8B949E] font-mono">current image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="text-sm text-[#8B949E] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-[#E6EDF3] file:font-mono file:text-sm hover:file:bg-white/15"
                                />
                            </div>

                            <input
                                name="github"
                                placeholder="GitHub URL"
                                value={form.github}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            <input
                                name="live"
                                placeholder="Live demo URL"
                                value={form.live}
                                onChange={handleChange}
                                className={inputClass}
                            />
                            {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-5 py-2 rounded-lg hover:bg-[#4ec4bc] disabled:opacity-50 transition"
                                >
                                    {uploading ? 'Uploading image...' : editingId ? 'Update Project' : 'Add Project'}
                                </button>
                                <button type="button" onClick={resetForm} className="text-[#8B949E] hover:underline font-mono text-sm">
                                    cancel
                                </button>
                            </div>
                        </form>
                        )}

                        <div className="flex flex-col gap-4">
                            {projects.map((project) => (
                                <div key={project._id} className="bg-[#161B22] border border-white/10 p-4 rounded-lg flex justify-between items-center gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        {project.image ? (
                                            <button
                                                onClick={() => setPreviewProject(project)}
                                                className="shrink-0 rounded-lg overflow-hidden border border-white/10 hover:border-[#5CDBD3]/50 transition"
                                                aria-label="Preview image"
                                            >
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-14 h-14 object-cover"
                                                />
                                            </button>
                                        ) : (
                                            <div className="shrink-0 w-14 h-14 rounded-lg bg-[#0D1117] border border-white/10 flex items-center justify-center">
                                                <span className="text-[#4b5563] text-xs font-mono">no img</span>
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-[#E6EDF3] truncate">{project.title}</h4>
                                            <p className="text-sm text-[#8B949E] font-mono truncate">{project.techStack.join(', ')}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        <button onClick={() => handleEdit(project)} className="text-[#5CDBD3] hover:underline text-sm font-mono">
                                            edit
                                        </button>
                                        <button onClick={() => handleDelete(project._id)} className="text-red-400 hover:underline text-sm font-mono">
                                            delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Project image lightbox — preview large, then edit or delete directly from here */}
                {previewProject && (
                    <div
                        onClick={() => setPreviewProject(null)}
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center px-4 cursor-pointer"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-lg w-full cursor-default"
                        >
                            <img
                                src={previewProject.image}
                                alt={previewProject.title}
                                className="w-full max-h-[65vh] object-contain rounded-xl border-4 border-[#161B22] shadow-2xl mb-4"
                            />
                            <div className="bg-[#161B22] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                <h4 className="text-[#E6EDF3] font-semibold font-mono truncate pr-4">{previewProject.title}</h4>
                                <div className="flex gap-4 shrink-0">
                                    <button
                                        onClick={() => {
                                            handleEdit(previewProject);
                                            setPreviewProject(null);
                                        }}
                                        className="text-[#5CDBD3] hover:underline text-sm font-mono"
                                    >
                                        edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(previewProject._id);
                                            setPreviewProject(null);
                                        }}
                                        className="text-red-400 hover:underline text-sm font-mono"
                                    >
                                        delete
                                    </button>
                                    <button
                                        onClick={() => setPreviewProject(null)}
                                        className="text-[#8B949E] hover:text-[#E6EDF3] text-sm font-mono"
                                    >
                                        close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="flex flex-col gap-4">
                        {messages.length === 0 && <p className="text-[#8B949E] font-mono text-sm">no messages yet.</p>}
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`p-4 rounded-lg flex justify-between items-start border ${msg.read ? 'bg-[#161B22] border-white/10' : 'bg-[#5CDBD3]/5 border-[#5CDBD3]/30'
                                    }`}
                            >
                                <div>
                                    <p className="font-semibold text-[#E6EDF3]">
                                        {msg.name} <span className="text-[#8B949E] font-normal text-sm">({msg.email})</span>
                                    </p>
                                    <p className="text-[#8B949E] mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>{msg.message}</p>
                                    <p className="text-xs text-[#4b5563] mt-2 font-mono">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    {!msg.read && (
                                        <button
                                            onClick={() => handleMarkRead(msg._id)}
                                            className="text-[#5CDBD3] hover:underline text-sm whitespace-nowrap font-mono"
                                        >
                                            mark read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteMessage(msg._id)}
                                        className="text-red-400 hover:underline text-sm font-mono"
                                    >
                                        delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'profile' && (
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                    <div className="bg-[#161B22] border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1 text-[#E6EDF3] font-mono">home page photo</h3>
                            <p className="text-sm text-[#8B949E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Upload your photo once, then use the switch below to show or hide it
                                on your Home page any time — no code changes needed.
                            </p>
                        </div>

                        {settings.profileImage && (
                            <img
                                src={settings.profileImage}
                                alt="Profile preview"
                                className="w-24 h-24 rounded-full object-cover border border-white/10"
                            />
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                ref={profileFileInputRef}
                                onChange={handleProfileImageChange}
                                className="flex-1 text-sm text-[#8B949E] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-[#E6EDF3] file:font-mono file:text-sm hover:file:bg-white/15"
                            />
                            <button
                                onClick={handleUploadProfileImage}
                                disabled={!profileImageFile || profileUploading}
                                className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-4 py-2 rounded-lg hover:bg-[#4ec4bc] disabled:opacity-50 text-sm whitespace-nowrap transition"
                            >
                                {profileUploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>

                        {settings.profileImage && (
                            <button
                                onClick={handleRemoveProfileImage}
                                className="text-red-400 hover:underline text-sm font-mono self-start"
                            >
                                remove photo (deletes from Cloudinary too)
                            </button>
                        )}

                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                            <div>
                                <p className="font-medium text-[#E6EDF3] font-mono text-sm">show photo on home page</p>
                                <p className="text-sm text-[#8B949E] font-mono">
                                    Currently: {settings.showProfileImage ? 'Visible' : 'Hidden'}
                                    {settingsSaved && <span className="text-[#7EE787] ml-2">Saved ✓</span>}
                                </p>
                            </div>
                            <button
                                onClick={handleToggleShowImage}
                                disabled={!settings.profileImage}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition disabled:opacity-40 ${settings.showProfileImage ? 'bg-[#5CDBD3]' : 'bg-white/10'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-[#0D1117] transition ${settings.showProfileImage ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        {!settings.profileImage && (
                            <p className="text-xs text-[#4b5563] font-mono">
                                Upload a photo first — the switch unlocks once you have one.
                            </p>
                        )}
                    </div>

                    <div className="bg-[#161B22] border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1 text-[#E6EDF3] font-mono">resume</h3>
                            <p className="text-sm text-[#8B949E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Upload a PDF — this becomes the file linked from your Home page's
                                "resume.pdf" button. Uploading a new one automatically replaces
                                and deletes the old one from Cloudinary.
                            </p>
                        </div>

                        {settings.resumeUrl && (
                            <a
                                href={settings.resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-[#5CDBD3] hover:underline text-sm font-mono self-start"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                view current resume
                            </a>
                        )}

                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={resumeFileInputRef}
                                onChange={handleResumeFileChange}
                                className="flex-1 text-sm text-[#8B949E] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-[#E6EDF3] file:font-mono file:text-sm hover:file:bg-white/15"
                            />
                            <button
                                onClick={handleUploadResume}
                                disabled={!resumeFile || resumeUploading}
                                className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-4 py-2 rounded-lg hover:bg-[#4ec4bc] disabled:opacity-50 text-sm whitespace-nowrap transition"
                            >
                                {resumeUploading ? 'Uploading...' : settings.resumeUrl ? 'Replace' : 'Upload'}
                            </button>
                        </div>

                        {settings.resumeUrl && (
                            <button
                                onClick={handleRemoveResume}
                                className="text-red-400 hover:underline text-sm font-mono self-start"
                            >
                                remove resume (deletes from Cloudinary too)
                            </button>
                        )}

                        {!settings.resumeUrl && (
                            <p className="text-xs text-[#4b5563] font-mono">
                                No resume uploaded yet — the Home page button won't work until you add one.
                            </p>
                        )}
                    </div>

                    <div className="bg-[#161B22] border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1 text-[#E6EDF3] font-mono">fun page link</h3>
                            <p className="text-sm text-[#8B949E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Controls whether the 🎮 icon linking to /fun shows up in the
                                Navbar. The /fun page itself always works if someone knows the URL —
                                this just hides the public hint when you're not in the mood for it.
                            </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                            <div>
                                <p className="font-medium text-[#E6EDF3] font-mono text-sm">show 🎮 in navbar</p>
                                <p className="text-sm text-[#8B949E] font-mono">
                                    Currently: {settings.showFunLink ? 'Visible' : 'Hidden'}
                                </p>
                            </div>
                            <button
                                onClick={handleToggleFunLink}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${settings.showFunLink ? 'bg-[#5CDBD3]' : 'bg-white/10'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-[#0D1117] transition ${settings.showFunLink ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#161B22] border border-white/10 p-6 rounded-xl flex flex-col gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-1 text-[#E6EDF3] font-mono">github activity</h3>
                            <p className="text-sm text-[#8B949E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                Shows your GitHub contribution graph on the About page.
                                Enter your username, save it, then use the switch to show or hide it.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="your-github-username"
                                value={githubInput}
                                onChange={(e) => setGithubInput(e.target.value)}
                                className="flex-1 bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition text-sm font-mono"
                            />
                            <button
                                onClick={handleSaveGithubUsername}
                                className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-4 py-2 rounded-lg hover:bg-[#4ec4bc] text-sm whitespace-nowrap transition"
                            >
                                Save
                            </button>
                        </div>
                        {githubSaved && <p className="text-[#7EE787] text-sm font-mono">Saved ✓</p>}

                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                            <div>
                                <p className="font-medium text-[#E6EDF3] font-mono text-sm">show graph on about page</p>
                                <p className="text-sm text-[#8B949E] font-mono">
                                    Currently: {settings.showGithubGraph ? 'Visible' : 'Hidden'}
                                </p>
                            </div>
                            <button
                                onClick={handleToggleGithubGraph}
                                disabled={!settings.githubUsername}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition disabled:opacity-40 ${settings.showGithubGraph ? 'bg-[#5CDBD3]' : 'bg-white/10'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-[#0D1117] transition ${settings.showGithubGraph ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                        {!settings.githubUsername && (
                            <p className="text-xs text-[#4b5563] font-mono">
                                Save a username first — the switch unlocks once you have one.
                            </p>
                        )}
                    </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-4xl mt-6">
                        <div className="bg-[#161B22] border border-white/10 p-6 rounded-xl flex flex-col gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1 text-[#E6EDF3] font-mono">now page</h3>
                                <p className="text-sm text-[#8B949E]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    A short update shown at /now — what you're currently building,
                                    learning, or focused on. Update it whenever; the "last updated"
                                    date on the page updates automatically.
                                </p>
                            </div>
                            <textarea
                                rows="4"
                                placeholder="e.g. Currently learning TypeScript and rebuilding this portfolio's backend with it."
                                value={nowInput}
                                onChange={(e) => setNowInput(e.target.value)}
                                className="w-full bg-[#0D1117] border border-white/10 text-[#E6EDF3] placeholder-[#4b5563] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#5CDBD3]/50 focus:border-transparent transition text-sm"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSaveNowText}
                                    className="bg-[#5CDBD3] text-[#0D1117] font-semibold px-4 py-2 rounded-lg hover:bg-[#4ec4bc] text-sm transition"
                                >
                                    Save
                                </button>
                                {nowSaved && <span className="text-[#7EE787] text-sm font-mono">Saved ✓</span>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;