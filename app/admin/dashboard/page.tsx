'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type Property, formatPrice } from '@/lib/properties';
import { type Project } from '@/lib/project';

export default function AdminDashboard() {
    // Current Active Tab: 'properties' | 'projects'
    const [activeTab, setActiveTab] = useState<'properties' | 'projects'>('properties');

    // ==========================================
    // PROPERTIES STATE & HANDLERS
    // ==========================================
    const [properties, setProperties] = useState<Property[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState<Partial<Property>>({
        title: '',
        price: 0,
        location: '',
        type: 'House',
        category: 'Residential',
        status: 'For Sale',
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        featured: false,
        image: '',
        description: '',
        yearBuilt: new Date().getFullYear(),
        parking: 0,
    });

    // ==========================================
    // PROJECTS STATE & HANDLERS
    // ==========================================
    const [projects, setProjects] = useState<Project[]>([]);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
    const [showProjectDeleteModal, setShowProjectDeleteModal] = useState(false);
    const [isProjectUploading, setIsProjectUploading] = useState(false);
    const [projectFormData, setProjectFormData] = useState<any>({
        title: '',
        slug: '',
        location: '',
        status: 'Under Construction',
        zone: 'West',
        bedrooms: '2 & 3',
        bathrooms: 2,
        displayPrice: 'Price On Request',
        PlotArea: '',
        address: '',
        description: '',
        image: '',
        images: [] as string[],
        featured: false,
        isForSale: true,
        rera: '',
        blogId: '',
        possession: '',
        totalTowers: '',
        totalFloors: '',
        totalUnits: '',
        unitTypes: [] as { type: string; area: string; description: string }[],
        amenities: [] as string[],
    });
    const [newAmenity, setNewAmenity] = useState('');

    useEffect(() => {
        fetchProperties();
        fetchProjects();
    }, []);

    const fetchProperties = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('/api/properties');
            if (!res.ok) throw new Error('Failed to fetch properties');
            const data = await res.json();
            const validData = data.map((p: any) => ({
                ...p,
                featured: p.featured === 1 || p.featured === true,
                price: Number(p.price) || 0,
                bedrooms: Number(p.bedrooms) || 0,
                bathrooms: Number(p.bathrooms) || 0,
                area: Number(p.area) || 0,
                image: p.image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            }));
            setProperties(validData);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProjects = async () => {
        try {
            setIsProjectsLoading(true);
            const res = await fetch('/api/projects');
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsProjectsLoading(false);
        }
    };

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProperty) {
                const res = await fetch(`/api/properties/${editingProperty.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to update property');
            } else {
                const res = await fetch('/api/properties', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to create property');
            }

            fetchProperties();
            closeModal();
            alert(editingProperty ? 'Property updated successfully!' : 'Property added successfully!');
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property');
        }
    };

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setFormData(property);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await fetch(`/api/properties/${deleteId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Failed to delete property');

                fetchProperties();
                alert('Property deleted successfully');
                setShowDeleteModal(false);
                setDeleteId(null);
            } catch (error) {
                console.error('Error deleting property:', error);
                alert('Failed to delete property');
            }
        }
    };

    const openModal = () => {
        setEditingProperty(null);
        setFormData({
            title: '',
            price: 0,
            location: '',
            type: 'House',
            category: 'Residential',
            status: 'For Sale',
            bedrooms: 0,
            bathrooms: 0,
            area: 0,
            featured: false,
            image: '',
            description: '',
            yearBuilt: new Date().getFullYear(),
            parking: 0,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProperty(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);

        if (files.some(file => file.size > 5 * 1024 * 1024)) {
            alert('One or more files exceed 5MB limit. Please upload smaller images.');
            return;
        }

        setIsUploading(true);
        let uploadedUrls: string[] = [];

        try {
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL || 'https://coral-octopus-898616.hostingersite.com/upload.php';

            for (const file of files) {
                const form = new FormData();
                form.append('file', file);

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: form,
                });

                if (!res.ok) {
                    throw new Error(`Server responded with ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                if (data.success) {
                    uploadedUrls.push(data.url);
                } else {
                    alert('Upload failed for a file: ' + data.message);
                }
            }

            if (uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    image: prev.image ? prev.image + ',' + uploadedUrls.join(',') : uploadedUrls.join(',')
                }));
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.message || 'Unknown error'));
        } finally {
            setIsUploading(false);
        }
    };

    // ==========================================
    // PROJECT CRUD ACTIONS
    // ==========================================
    const openProjectModal = () => {
        setEditingProject(null);
        setProjectFormData({
            title: '',
            slug: '',
            location: '',
            status: 'Under Construction',
            zone: 'West',
            bedrooms: '2 & 3',
            bathrooms: 2,
            displayPrice: 'Price On Request',
            PlotArea: '',
            address: '',
            description: '',
            image: '',
            images: [],
            featured: false,
            isForSale: true,
            rera: '',
            blogId: '',
            possession: '',
            totalTowers: '',
            totalFloors: '',
            totalUnits: '',
            unitTypes: [
                { type: '3 BHK', area: '1500 Sq.ft', description: 'Spacious apartment with premium fittings' }
            ],
            amenities: ['Gymnasium', 'Swimming Pool', 'Landscaped Garden', 'Children Play Area'],
        });
        setShowProjectModal(true);
    };

    const closeProjectModal = () => {
        setShowProjectModal(false);
        setEditingProject(null);
    };

    const handleProjectEdit = (proj: any) => {
        setEditingProject(proj);
        setProjectFormData({
            ...proj,
            images: Array.isArray(proj.images) ? proj.images : (proj.images ? [proj.images] : []),
            unitTypes: Array.isArray(proj.unitTypes) ? proj.unitTypes : [],
            amenities: Array.isArray(proj.amenities) ? proj.amenities : [],
            blogId: proj.blogId ? String(proj.blogId) : '',
            totalTowers: proj.totalTowers ? String(proj.totalTowers) : '',
            totalFloors: proj.totalFloors ? String(proj.totalFloors) : '',
            totalUnits: proj.totalUnits ? String(proj.totalUnits) : '',
        });
        setShowProjectModal(true);
    };

    const handleProjectDelete = (id: number) => {
        setDeleteProjectId(id);
        setShowProjectDeleteModal(true);
    };

    const confirmProjectDelete = async () => {
        if (deleteProjectId !== null) {
            try {
                const res = await fetch(`/api/projects/${deleteProjectId}`, {
                    method: 'DELETE',
                });
                if (!res.ok) throw new Error('Failed to delete project');

                fetchProjects();
                alert('Project deleted successfully');
                setShowProjectDeleteModal(false);
                setDeleteProjectId(null);
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project');
            }
        }
    };

    const handleProjectInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setProjectFormData((prev: any) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleProjectMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        if (file.size > 5 * 1024 * 1024) {
            alert('File exceeds 5MB limit.');
            return;
        }

        setIsProjectUploading(true);
        try {
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL || 'https://coral-octopus-898616.hostingersite.com/upload.php';
            const form = new FormData();
            form.append('file', file);

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: form,
            });

            if (!res.ok) throw new Error(`Upload server returned ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setProjectFormData((prev: any) => ({
                    ...prev,
                    image: data.url
                }));
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err: any) {
            alert('Error uploading main image: ' + err.message);
        } finally {
            setIsProjectUploading(false);
        }
    };

    const handleProjectGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const files = Array.from(e.target.files);

        if (files.some(f => f.size > 5 * 1024 * 1024)) {
            alert('One or more gallery images exceed 5MB limit.');
            return;
        }

        setIsProjectUploading(true);
        try {
            const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_API_URL || 'https://coral-octopus-898616.hostingersite.com/upload.php';
            const uploadedUrls: string[] = [];

            for (const file of files) {
                const form = new FormData();
                form.append('file', file);

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: form,
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success) uploadedUrls.push(data.url);
                }
            }

            if (uploadedUrls.length > 0) {
                setProjectFormData((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploadedUrls]
                }));
            }
        } catch (err: any) {
            alert('Error uploading gallery images: ' + err.message);
        } finally {
            setIsProjectUploading(false);
        }
    };

    const addUnitType = () => {
        setProjectFormData((prev: any) => ({
            ...prev,
            unitTypes: [
                ...(prev.unitTypes || []),
                { type: '', area: '', description: '' }
            ]
        }));
    };

    const updateUnitType = (index: number, field: string, value: string) => {
        setProjectFormData((prev: any) => {
            const updated = [...(prev.unitTypes || [])];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, unitTypes: updated };
        });
    };

    const removeUnitType = (index: number) => {
        setProjectFormData((prev: any) => ({
            ...prev,
            unitTypes: prev.unitTypes.filter((_: any, i: number) => i !== index)
        }));
    };

    const addAmenity = () => {
        if (!newAmenity.trim()) return;
        setProjectFormData((prev: any) => ({
            ...prev,
            amenities: [...(prev.amenities || []), newAmenity.trim()]
        }));
        setNewAmenity('');
    };

    const removeAmenity = (index: number) => {
        setProjectFormData((prev: any) => ({
            ...prev,
            amenities: prev.amenities.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProject) {
                const res = await fetch(`/api/projects/${editingProject.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectFormData),
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Failed to update project');
                }
            } else {
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectFormData),
                });
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Failed to create project');
                }
            }

            fetchProjects();
            closeProjectModal();
            alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
        } catch (error: any) {
            console.error('Error saving project:', error);
            alert('Failed to save project: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const propertyStats = [
        { label: 'Total Properties', value: properties.length, icon: 'fa-home', color: 'primary' },
        { label: 'For Sale', value: properties.filter(p => p.status === 'For Sale').length, icon: 'fa-tag', color: 'success' },
        { label: 'For Rent', value: properties.filter(p => p.status === 'For Rent').length, icon: 'fa-key', color: 'info' },
        { label: 'Featured', value: properties.filter(p => p.featured).length, icon: 'fa-star', color: 'warning' },
    ];

    const projectStats = [
        { label: 'Total Projects', value: projects.length, icon: 'fa-building', color: 'primary' },
        { label: 'Under Construction', value: projects.filter(p => p.status?.toLowerCase().includes('construction')).length, icon: 'fa-hard-hat', color: 'warning' },
        { label: 'Upcoming / Arriving', value: projects.filter(p => p.status?.toLowerCase().includes('upcoming') || p.status?.toLowerCase().includes('arriving')).length, icon: 'fa-clock', color: 'info' },
        { label: 'Featured Projects', value: projects.filter(p => p.featured).length, icon: 'fa-star', color: 'success' },
    ];

    if (isLoading && isProjectsLoading) {
        return <div className="flex h-screen items-center justify-center font-medium text-lg text-[#0f1e3d]">Loading Dashboard...</div>;
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <div className="flex min-h-screen bg-gray-50">
                {/* SIDEBAR */}
                <aside className="w-64 bg-[#0f1e3d] text-white p-6 sticky top-0 h-screen overflow-y-auto flex flex-col justify-between shadow-xl z-20">
                    <div>
                        {/* Logo */}
                        <div className="text-center mb-6 pb-4 border-b border-white/10">
                            <img src="/images/logo.png" alt="Avishkar Logo" className="mx-auto max-h-12 object-contain" />
                        </div>

                        {/* Navigation Menu */}
                        <nav>
                            <ul className="space-y-2">
                                {/* 1. DASHBOARD / PROPERTIES */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('properties')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'properties'
                                            ? 'bg-[#e4c272] text-[#0f1e3d] shadow-md'
                                            : 'text-[#e4c272] hover:bg-white/10'
                                            }`}
                                    >
                                        <i className="fas fa-tachometer-alt w-5 text-center"></i>
                                        Dashboard
                                    </button>
                                </li>

                                {/* 2. ADD PROPERTY (Moved directly below Dashboard as requested) */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('properties');
                                            openModal();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#e4c272]/15 text-[#e4c272] border border-[#e4c272]/30 hover:bg-[#e4c272] hover:text-[#0f1e3d] transition-all"
                                    >
                                        <i className="fas fa-plus-circle w-5 text-center"></i>
                                        + Add Property
                                    </button>
                                </li>

                                <li className="pt-2 pb-1">
                                    <div className="border-t border-white/10"></div>
                                </li>

                                {/* 3. PROJECTS TAB */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('projects')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'projects'
                                            ? 'bg-[#e4c272] text-[#0f1e3d] shadow-md'
                                            : 'text-white/90 hover:bg-white/10 hover:text-[#e4c272]'
                                            }`}
                                    >
                                        <i className="fas fa-city w-5 text-center"></i>
                                        Projects List
                                    </button>
                                </li>

                                {/* 4. ADD PROJECT (Added right below Add Property / Projects) */}
                                <li>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveTab('projects');
                                            openProjectModal();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                        <i className="fas fa-folder-plus w-5 text-center"></i>
                                        + Add Project
                                    </button>
                                </li>

                                <li className="pt-2 pb-1">
                                    <div className="border-t border-white/10"></div>
                                </li>

                                {/* 5. VIEW WEBSITE */}
                                <li>
                                    <Link
                                        href="/"
                                        target="_blank"
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        <i className="fas fa-globe w-5 text-center"></i>
                                        View Website
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Bottom Logout Button */}
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-left font-medium"
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center"></i>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 p-8 overflow-y-auto max-h-screen">
                    {/* ============================================================ */}
                    {/* 1. PROPERTIES TAB CONTENT */}
                    {/* ============================================================ */}
                    {activeTab === 'properties' && (
                        <div>
                            {/* Header */}
                            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0f1e3d]">Property Management</h1>
                                    <p className="text-gray-600 mt-1">Manage and edit your real estate listings</p>
                                </div>
                                <button
                                    onClick={openModal}
                                    className="bg-[#0f1e3d] text-[#e4c272] px-6 py-3 rounded-lg font-semibold hover:bg-[#e4c272] hover:text-[#0f1e3d] border border-[#0f1e3d] transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <i className="fas fa-plus"></i>
                                    Add Property
                                </button>
                            </div>

                            {/* Property Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {propertyStats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 border border-gray-100">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                            style={{
                                                backgroundColor: stat.color === 'primary' ? 'rgba(228, 194, 114, 0.15)' :
                                                    stat.color === 'success' ? 'rgba(40, 167, 69, 0.12)' :
                                                        stat.color === 'info' ? 'rgba(23, 162, 184, 0.12)' :
                                                            'rgba(255, 193, 7, 0.12)',
                                                color: stat.color === 'primary' ? '#bfa048' :
                                                    stat.color === 'success' ? '#28A745' :
                                                        stat.color === 'info' ? '#17A2B8' :
                                                            '#FFC107'
                                            }}
                                        >
                                            <i className={`fas ${stat.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-[#0f1e3d]">{stat.value}</div>
                                            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Properties Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-[#0f1e3d]">All Properties ({properties.length})</h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Image</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Title</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Type</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Price</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Category</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Location</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {properties.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-10 text-gray-500">
                                                        No properties found. Click &quot;Add Property&quot; to create one.
                                                    </td>
                                                </tr>
                                            ) : (
                                                properties.map((property) => (
                                                    <tr key={property.id} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                                <img
                                                                    src={property.image.split(',')[0]}
                                                                    alt={property.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-[#0f1e3d]">{property.title}</div>
                                                            {property.featured && (
                                                                <span className="inline-block mt-1 text-xs bg-[#e4c272] text-[#0f1e3d] font-bold px-2 py-0.5 rounded">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">{property.type}</td>
                                                        <td className="px-6 py-4 font-bold text-[#bfa048]">
                                                            {formatPrice(property.price)}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                                            {property.category}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${property.status === 'For Sale'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {property.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 text-sm">{property.location}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={`/properties/${property.id}`}
                                                                    target="_blank"
                                                                    title="View Property"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-eye text-xs"></i>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleEdit(property)}
                                                                    title="Edit Property"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-edit text-xs"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(property.id)}
                                                                    title="Delete Property"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-trash text-xs"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ============================================================ */}
                    {/* 2. PROJECTS TAB CONTENT */}
                    {/* ============================================================ */}
                    {activeTab === 'projects' && (
                        <div>
                            {/* Header */}
                            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#0f1e3d]">Project Management</h1>
                                    <p className="text-gray-600 mt-1">Manage your luxury and commercial project developments</p>
                                </div>
                                <button
                                    onClick={openProjectModal}
                                    className="bg-[#0f1e3d] text-[#e4c272] px-6 py-3 rounded-lg font-semibold hover:bg-[#e4c272] hover:text-[#0f1e3d] border border-[#0f1e3d] transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <i className="fas fa-plus"></i>
                                    Add Project
                                </button>
                            </div>

                            {/* Project Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {projectStats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 border border-gray-100">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                                            style={{
                                                backgroundColor: stat.color === 'primary' ? 'rgba(228, 194, 114, 0.15)' :
                                                    stat.color === 'warning' ? 'rgba(255, 193, 7, 0.12)' :
                                                        stat.color === 'info' ? 'rgba(23, 162, 184, 0.12)' :
                                                            'rgba(40, 167, 69, 0.12)',
                                                color: stat.color === 'primary' ? '#bfa048' :
                                                    stat.color === 'warning' ? '#d39e00' :
                                                        stat.color === 'info' ? '#17A2B8' :
                                                            '#28A745'
                                            }}
                                        >
                                            <i className={`fas ${stat.icon}`}></i>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold text-[#0f1e3d]">{stat.value}</div>
                                            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Projects Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-[#0f1e3d]">All Projects ({projects.length})</h2>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Image</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Project Title</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Location</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Bedrooms</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Price</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">RERA</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f1e3d]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {projects.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="text-center py-10 text-gray-500">
                                                        No projects found. Click &quot;Add Project&quot; to create one.
                                                    </td>
                                                </tr>
                                            ) : (
                                                projects.map((proj: any) => (
                                                    <tr key={proj.id} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                                <img
                                                                    src={proj.image || '/images/project/bg4.jpg'}
                                                                    alt={proj.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-[#0f1e3d]">{proj.title}</div>
                                                            <div className="text-xs text-gray-400 font-mono">/project/{proj.slug}</div>
                                                            <div className="flex gap-1 mt-1">
                                                                {proj.featured && (
                                                                    <span className="text-[10px] bg-[#0f1e3d] text-[#e4c272] font-bold px-2 py-0.5 rounded">
                                                                        Featured
                                                                    </span>
                                                                )}
                                                                {proj.isForSale && (
                                                                    <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">
                                                                        For Sale
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 text-sm">
                                                            <div>{proj.location}</div>
                                                            {proj.zone && <div className="text-xs text-gray-400">Zone: {proj.zone}</div>}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                                                {proj.status || 'Under Construction'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 font-medium text-sm">
                                                            {proj.bedrooms} BHK
                                                        </td>
                                                        <td className="px-6 py-4 font-bold text-[#bfa048]">
                                                            {proj.displayPrice || 'Price On Request'}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs text-gray-500 max-w-[150px] truncate" title={proj.rera}>
                                                            {proj.rera ? proj.rera.slice(0, 18) + '...' : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={`/project/${proj.slug}`}
                                                                    target="_blank"
                                                                    title="View Live Project Page"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-eye text-xs"></i>
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleProjectEdit(proj)}
                                                                    title="Edit Project"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-edit text-xs"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleProjectDelete(proj.id)}
                                                                    title="Delete Project"
                                                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                                >
                                                                    <i className="fas fa-trash text-xs"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ============================================================ */}
            {/* PROPERTY MODAL (ADD / EDIT) */}
            {/* ============================================================ */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-bold text-[#0f1e3d]">
                                {editingProperty ? 'Edit Property' : 'Add New Property'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    >
                                        <option value="Villa">Villa</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Bungalow">Bungalow</option>
                                        <option value="Land">Land</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Shop">Shop</option>
                                        <option value="Showroom">Showroom</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    >
                                        <option value="Residential">Residential</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Industrial">Industrial</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    >
                                        <option value="For Sale">For Sale</option>
                                        <option value="For Rent">For Rent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                    <input
                                        type="number"
                                        name="bedrooms"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                    <input
                                        type="number"
                                        name="bathrooms"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (sqft)</label>
                                    <input
                                        type="number"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Year Built</label>
                                    <input
                                        type="number"
                                        name="yearBuilt"
                                        value={formData.yearBuilt}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Parking Spaces</label>
                                    <input
                                        type="number"
                                        name="parking"
                                        value={formData.parking}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Image(s)</label>
                                    <div className="flex items-center gap-4 mb-4">
                                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {isUploading ? (
                                                    <i className="fas fa-spinner fa-spin text-2xl text-[#bfa048] mb-2"></i>
                                                ) : (
                                                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    {isUploading ? 'Uploading...' : 'Click to upload image'}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    {formData.image && (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                            {formData.image.split(',').filter(Boolean).map((url, idx) => (
                                                <div key={idx} className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newUrls = formData.image!.split(',').filter((_, i) => i !== idx);
                                                            setFormData(prev => ({ ...prev, image: newUrls.join(',') }));
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md text-sm"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Or enter Image URL directly"
                                        value={formData.image || ''}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0f1e3d] focus:ring-2 focus:ring-[#0f1e3d]/20"
                                    ></textarea>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-[#0f1e3d] border-gray-300 rounded focus:ring-[#0f1e3d]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Mark as Featured Property</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#0f1e3d] text-[#e4c272] border px-8 py-3 rounded-lg font-semibold hover:bg-[#e4c272] hover:text-[#0f1e3d] hover:border-[#0f1e3d] transition-colors"
                                >
                                    {editingProperty ? 'Update Property' : 'Add Property'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* PROJECT MODAL (ADD / EDIT ALL DETAILS) */}
            {/* ============================================================ */}
            {showProjectModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-20">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0f1e3d]">
                                    {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Configure project specifications, unit types, and media</p>
                            </div>
                            <button
                                onClick={closeProjectModal}
                                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleProjectSubmit} className="p-6 space-y-6">
                            {/* Section 1: Basic Info */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-base font-bold text-[#0f1e3d] mb-4 flex items-center gap-2">
                                    <i className="fas fa-info-circle text-[#bfa048]"></i>
                                    Basic Project Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={projectFormData.title}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. Om Eclat Heights"
                                            required
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug (leave empty to auto-generate)</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={projectFormData.slug}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. om-eclat-heights"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Area *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={projectFormData.location}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. Zundal, Ahmedabad"
                                            required
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={projectFormData.status}
                                            onChange={handleProjectInputChange}
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        >
                                            <option value="Under Construction">Under Construction</option>
                                            <option value="Upcoming">Upcoming</option>
                                            <option value="Arriving Soon">Arriving Soon</option>
                                            <option value="Ready to Move">Ready to Move</option>
                                            <option value="Proposed">Proposed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Zone</label>
                                        <input
                                            type="text"
                                            name="zone"
                                            value={projectFormData.zone}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. North, West, North-West, East"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={projectFormData.address}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 120 ft Road, Nr. Sakar Prime, Zundal"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Specs & Pricing */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-base font-bold text-[#0f1e3d] mb-4 flex items-center gap-2">
                                    <i className="fas fa-layer-group text-[#bfa048]"></i>
                                    Pricing, Sizes & Structure
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrooms / BHK Config</label>
                                        <input
                                            type="text"
                                            name="bedrooms"
                                            value={projectFormData.bedrooms}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 2 & 3 or 4"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bathrooms</label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={projectFormData.bathrooms}
                                            onChange={handleProjectInputChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Display Price</label>
                                        <input
                                            type="text"
                                            name="displayPrice"
                                            value={projectFormData.displayPrice}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. ₹65 Lacs* or Price On Request"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Plot Area / Super Built-up</label>
                                        <input
                                            type="text"
                                            name="PlotArea"
                                            value={projectFormData.PlotArea}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 3500 Sq.ft or 335 – 431 Sq Yards"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Possession Date</label>
                                        <input
                                            type="text"
                                            name="possession"
                                            value={projectFormData.possession}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. Mid 2028 or December 2026"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">RERA Number</label>
                                        <input
                                            type="text"
                                            name="rera"
                                            value={projectFormData.rera}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. PR/GJ/AHMEDABAD/..."
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Towers</label>
                                        <input
                                            type="number"
                                            name="totalTowers"
                                            value={projectFormData.totalTowers}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 3"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Floors</label>
                                        <input
                                            type="number"
                                            name="totalFloors"
                                            value={projectFormData.totalFloors}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 14"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Blog ID (optional)</label>
                                        <input
                                            type="number"
                                            name="blogId"
                                            value={projectFormData.blogId}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g. 11"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={projectFormData.featured}
                                            onChange={handleProjectInputChange}
                                            className="w-4 h-4 text-[#0f1e3d] rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Mark as Featured Project</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isForSale"
                                            checked={projectFormData.isForSale}
                                            onChange={handleProjectInputChange}
                                            className="w-4 h-4 text-[#0f1e3d] rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Show &quot;For Sale&quot; Badge</span>
                                    </label>
                                </div>
                            </div>

                            {/* Section 3: Media & Images */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-base font-bold text-[#0f1e3d] mb-4 flex items-center gap-2">
                                    <i className="fas fa-images text-[#bfa048]"></i>
                                    Project Images & Gallery
                                </h3>

                                {/* Main Image */}
                                <div className="mb-5">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Main Cover Image *</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="cursor-pointer bg-[#0f1e3d] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#e4c272] hover:text-[#0f1e3d] transition-all">
                                            <i className="fas fa-upload mr-1"></i> Upload Cover
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleProjectMainImageUpload}
                                                disabled={isProjectUploading}
                                            />
                                        </label>
                                        <span className="text-xs text-gray-400">or enter image path / URL below</span>
                                    </div>
                                    <input
                                        type="text"
                                        name="image"
                                        value={projectFormData.image}
                                        onChange={handleProjectInputChange}
                                        placeholder="e.g. /images/project/Om-heights1.png or https://..."
                                        required
                                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                                    />
                                    {projectFormData.image && (
                                        <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                                            <img src={projectFormData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                {/* Gallery Images */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Gallery Images</label>
                                    <div className="flex items-center gap-4 mb-2">
                                        <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-all">
                                            <i className="fas fa-plus mr-1"></i> Upload More Photos
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleProjectGalleryUpload}
                                                disabled={isProjectUploading}
                                            />
                                        </label>
                                    </div>

                                    {projectFormData.images && projectFormData.images.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-3">
                                            {projectFormData.images.map((url: string, idx: number) => (
                                                <div key={idx} className="relative w-full h-20 rounded-lg overflow-hidden border border-gray-200">
                                                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setProjectFormData((prev: any) => ({
                                                                ...prev,
                                                                images: prev.images.filter((_: any, i: number) => i !== idx)
                                                            }));
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 4: Unit Types Builder */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-base font-bold text-[#0f1e3d] flex items-center gap-2">
                                        <i className="fas fa-th-large text-[#bfa048]"></i>
                                        Unit Configurations (Floor Plans)
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addUnitType}
                                        className="bg-[#0f1e3d] text-white text-xs px-3 py-1.5 rounded-md hover:bg-[#e4c272] hover:text-[#0f1e3d] transition-all"
                                    >
                                        + Add Unit Type
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {(!projectFormData.unitTypes || projectFormData.unitTypes.length === 0) ? (
                                        <p className="text-xs text-gray-400 italic">No unit types specified. Click &quot;+ Add Unit Type&quot; above to add 2 BHK, 3 BHK, Penthouse, etc.</p>
                                    ) : (
                                        projectFormData.unitTypes.map((unit: any, idx: number) => (
                                            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-3 items-start md:items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Unit Type (e.g. 2 BHK Type A)"
                                                    value={unit.type || ''}
                                                    onChange={e => updateUnitType(idx, 'type', e.target.value)}
                                                    className="w-full md:w-1/4 px-3 py-1.5 border border-gray-300 rounded text-xs"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Area (e.g. 1200 Sq Ft)"
                                                    value={unit.area || ''}
                                                    onChange={e => updateUnitType(idx, 'area', e.target.value)}
                                                    className="w-full md:w-1/4 px-3 py-1.5 border border-gray-300 rounded text-xs"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Description"
                                                    value={unit.description || ''}
                                                    onChange={e => updateUnitType(idx, 'description', e.target.value)}
                                                    className="w-full md:w-1/2 px-3 py-1.5 border border-gray-300 rounded text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeUnitType(idx)}
                                                    className="text-red-500 hover:text-red-700 text-sm px-2"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Section 5: Amenities */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-base font-bold text-[#0f1e3d] mb-3 flex items-center gap-2">
                                    <i className="fas fa-swimming-pool text-[#bfa048]"></i>
                                    Project Amenities
                                </h3>

                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Add amenity (e.g. Infinity Pool, Banquet Hall, Yoga Deck)"
                                        value={newAmenity}
                                        onChange={e => setNewAmenity(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs"
                                    />
                                    <button
                                        type="button"
                                        onClick={addAmenity}
                                        className="bg-[#0f1e3d] text-[#e4c272] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#e4c272] hover:text-[#0f1e3d]"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {projectFormData.amenities?.map((amenity: string, idx: number) => (
                                        <span key={idx} className="bg-white border border-gray-300 text-[#0f1e3d] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                            {amenity}
                                            <button
                                                type="button"
                                                onClick={() => removeAmenity(idx)}
                                                className="text-gray-400 hover:text-red-500 font-bold"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Section 6: Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
                                <textarea
                                    name="description"
                                    value={projectFormData.description}
                                    onChange={handleProjectInputChange}
                                    rows={4}
                                    placeholder="Comprehensive description of the project architecture, location advantages, lifestyle..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f1e3d]"
                                ></textarea>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#0f1e3d] text-[#e4c272] border border-[#0f1e3d] px-8 py-3 rounded-lg font-bold hover:bg-[#e4c272] hover:text-[#0f1e3d] transition-colors shadow-md"
                                >
                                    {editingProject ? 'Save Project Changes' : 'Publish New Project'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeProjectModal}
                                    className="px-8 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE PROPERTY CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Property Deletion</h2>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to permanently delete this property listing? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold shadow-md"
                            >
                                Delete Property
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE PROJECT CONFIRMATION MODAL */}
            {showProjectDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Project Deletion</h2>
                        <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this project? It will be removed from the live website immediately.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowProjectDeleteModal(false)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmProjectDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm font-bold shadow-md"
                            >
                                Delete Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
