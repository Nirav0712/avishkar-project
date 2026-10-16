'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { parseYouTubeUrl, parseInstagramUrl } from '@/lib/video';

// Types
interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  status: string;
  priority: string;
  property_id: number | null;
  project_id: number | null;
  property_title?: string;
  budget: string | null;
  preferred_location: string | null;
  property_type: string | null;
  assigned_to: string | null;
  notes: string | null;
  last_contact_date: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

interface FollowUp {
  id: number;
  lead_id: number;
  lead_name?: string;
  lead_phone?: string;
  property_title?: string;
  task_type: string;
  scheduled_at: string;
  notes: string | null;
  status: string;
  completed_at: string | null;
}

interface Deal {
  id: number;
  lead_id: number;
  lead_name?: string;
  lead_phone?: string;
  property_id: number | null;
  property_title?: string;
  deal_name: string;
  deal_value: number;
  stage: string;
  expected_close_date: string | null;
  assigned_agent: string | null;
  loss_reason: string | null;
  created_at: string;
}

interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  type: string;
  category: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  featured: boolean | number;
  image: string;
  description?: string;
  yearBuilt?: number;
  parking?: number;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  location: string;
  status: string;
  zone: string;
  bedrooms: string;
  displayPrice: string;
  PlotArea: string;
  rera: string;
  address: string;
  image: string;
  description?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  videoThumbnail?: string;
  videoTitle?: string;
  hasVideo?: boolean;
}

interface DashboardMetrics {
  totalLeads: number;
  newLeadsToday: number;
  newLeadsThisMonth: number;
  pipelineValue: number;
  overdueFollowUps: number;
  todayFollowUps: number;
  conversionRate: number;
  totalProperties: number;
  totalProjects: number;
  sourceBreakdown: { source: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  recentActivities: {
    id: number;
    lead_id: number;
    lead_name?: string;
    action_type: string;
    description: string;
    created_at: string;
  }[];
}

const PIPELINE_STAGES = [
  { id: 'New', label: 'New Enquiries', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { id: 'Contacted', label: 'Contacted', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { id: 'Qualified', label: 'Qualified', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { id: 'Site Visit Scheduled', label: 'Site Visit', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { id: 'Negotiation', label: 'Negotiation', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  { id: 'Won', label: 'Closed Won', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'Lost', label: 'Closed Lost', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
];

export default function AdminDashboardPage() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'leads' | 'pipeline' | 'followups' | 'deals' | 'properties' | 'projects' | 'settings'>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Property Submissions State (Module 3 & 4)
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionCounters, setSubmissionCounters] = useState<{
    total: number;
    pendingReview: number;
    underReview: number;
    approved: number;
    rejected: number;
    published: number;
    archived: number;
  }>({
    total: 0,
    pendingReview: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    published: 0,
    archived: 0,
  });
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('All');
  const [submissionPurposeFilter, setSubmissionPurposeFilter] = useState('All');
  const [submissionTypeFilter, setSubmissionTypeFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [submissionNotesDraft, setSubmissionNotesDraft] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [publishingSubmission, setPublishingSubmission] = useState<any | null>(null);
  const [publishForm, setPublishForm] = useState<any>({});
  const [publishingLoading, setPublishingLoading] = useState(false);
  const [statusConfirmModal, setStatusConfirmModal] = useState<{
    action: 'Under Review' | 'Approved' | 'Rejected' | 'Archived';
    submission: any;
    note: string;
  } | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Loading states
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Filters & Search
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [leadSourceFilter, setLeadSourceFilter] = useState('All');
  const [leadPriorityFilter, setLeadPriorityFilter] = useState('All');
  const [followupFilter, setFollowupFilter] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');

  // Modals & Drawers
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadActivities, setLeadActivities] = useState<any[]>([]);
  const [showAddFollowupModal, setShowAddFollowupModal] = useState(false);
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ type: 'lead' | 'property' | 'project'; id: number; title: string } | null>(null);

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    status: 'New',
    priority: 'Medium',
    property_title: '',
    budget: '',
    preferred_location: '',
    property_type: 'Apartment',
    notes: '',
  });

  const [followupForm, setFollowupForm] = useState({
    lead_id: '',
    task_type: 'Call',
    scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    notes: '',
  });

  const [dealForm, setDealForm] = useState({
    lead_id: '',
    property_id: '',
    deal_name: '',
    deal_value: '',
    stage: 'Proposal',
    expected_close_date: '',
    assigned_agent: 'Sales Team',
  });

  const [propertyForm, setPropertyForm] = useState<Partial<Property>>({
    title: '',
    price: 0,
    location: '',
    type: 'Apartment',
    category: 'Residential',
    status: 'For Sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    featured: false,
    image: '',
    description: '',
    parking: 1,
    yearBuilt: new Date().getFullYear(),
  });

  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    slug: '',
    location: '',
    status: 'Under Construction',
    zone: 'West',
    bedrooms: '3 & 4 BHK',
    displayPrice: 'Price on Request',
    PlotArea: '',
    rera: '',
    address: '',
    image: '',
    description: '',
    youtubeUrl: '',
    instagramUrl: '',
    videoThumbnail: '',
    videoTitle: '',
    hasVideo: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial load: Fetch all data concurrently so badges and tabs are populated immediately
  useEffect(() => {
    fetchAdminUser();
    fetchMetrics();
    fetchSubmissions();
    fetchLeads();
    fetchFollowups();
    fetchDeals();
    fetchProperties();
    fetchProjects();
  }, []);

  // Tab switch lazy-load & Submissions filter effect
  useEffect(() => {
    if (activeTab === 'overview') fetchMetrics();
    if (activeTab === 'submissions') fetchSubmissions();
    if (activeTab === 'leads' || activeTab === 'pipeline') fetchLeads();
    if (activeTab === 'followups') fetchFollowups();
    if (activeTab === 'deals') fetchDeals();
    if (activeTab === 'properties') fetchProperties();
    if (activeTab === 'projects') fetchProjects();
  }, [activeTab, submissionStatusFilter, submissionPurposeFilter, submissionTypeFilter, submissionSearch]);

  // Fetch admin session
  const fetchAdminUser = async () => {
    try {
      const res = await fetch('/api/crm/me');
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching admin user:', err);
    }
  };

  // Fetch Metrics
  const fetchMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await fetch('/api/crm/dashboard');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Error loading metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const res = await fetch('/api/crm/leads?limit=100');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error('Error loading leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  // Fetch Followups
  const fetchFollowups = async () => {
    try {
      setLoadingFollowups(true);
      const res = await fetch('/api/crm/followups');
      if (res.ok) {
        const data = await res.json();
        setFollowups(data.followups || []);
      }
    } catch (err) {
      console.error('Error loading followups:', err);
    } finally {
      setLoadingFollowups(false);
    }
  };

  // Fetch Deals
  const fetchDeals = async () => {
    try {
      setLoadingDeals(true);
      const res = await fetch('/api/crm/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch (err) {
      console.error('Error loading deals:', err);
    } finally {
      setLoadingDeals(false);
    }
  };

  // Fetch Properties
  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        setProperties(data.map((p: any) => ({
          ...p,
          featured: p.featured === 1 || p.featured === true,
          price: Number(p.price) || 0,
        })));
      }
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoadingProperties(false);
    }
  };

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // Fetch Property Submissions (Module 3)
  const fetchSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const params = new URLSearchParams();
      if (submissionStatusFilter !== 'All') params.append('status', submissionStatusFilter);
      if (submissionPurposeFilter !== 'All') params.append('purpose', submissionPurposeFilter);
      if (submissionTypeFilter !== 'All') params.append('type', submissionTypeFilter);
      if (submissionSearch) params.append('search', submissionSearch);

      const res = await fetch(`/api/property-submissions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        if (data.counters) setSubmissionCounters(data.counters);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Inspect Submission Drawer
  const openSubmissionDrawer = (sub: any) => {
    setSelectedSubmission(sub);
    setSubmissionNotesDraft(sub.admin_notes || '');
  };

  // Update Submission Status
  const handleUpdateSubmissionStatus = async (
    id: number,
    status: 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected' | 'Published' | 'Archived',
    note?: string
  ) => {
    try {
      const res = await fetch(`/api/property-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, admin_notes: note !== undefined ? note : submissionNotesDraft }),
      });
      if (res.ok) {
        showToast(`Submission moved to "${status}"`);
        setStatusConfirmModal(null);
        fetchSubmissions();
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission((prev: any) => ({
            ...prev,
            status,
            admin_notes: note !== undefined ? note : prev.admin_notes,
          }));
        }
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update status', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    }
  };

  // Save Submission Notes
  const handleSaveSubmissionNotes = async (id: number) => {
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/property-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: submissionNotesDraft }),
      });
      if (res.ok) {
        showToast('Review notes saved successfully');
        if (selectedSubmission) {
          setSelectedSubmission({ ...selectedSubmission, admin_notes: submissionNotesDraft });
        }
        fetchSubmissions();
      } else {
        showToast('Failed to save notes', 'error');
      }
    } catch {
      showToast('Error saving notes', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  // Open Publish Modal
  const handleOpenPublishModal = (sub: any) => {
    setPublishingSubmission(sub);
    setPublishForm({
      title: sub.property_title || '',
      price: sub.expected_price || 0,
      location: sub.locality || '',
      type: sub.property_type || 'Apartment',
      category: sub.listing_purpose === 'Rent' ? 'Rental' : 'Residential',
      status: sub.listing_purpose === 'Rent' ? 'For Rent' : 'For Sale',
      bedrooms: sub.bedrooms || 0,
      bathrooms: sub.bathrooms || 0,
      area: sub.area || 0,
      areaUnit: sub.area_unit || 'sq ft',
      featured: false,
      image: sub.images?.[0] || '',
      images: sub.images || [],
      description: sub.description || '',
      yearBuilt: new Date().getFullYear(),
      parking: sub.parking || 0,
      transaction: sub.listing_purpose === 'Rent' ? 'rent' : 'resale',
    });
  };

  // Submit Publication to Properties
  const handleConfirmPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishingSubmission) return;

    try {
      setPublishingLoading(true);
      const res = await fetch(`/api/property-submissions/${publishingSubmission.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(publishForm),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Property published successfully to live website!');
        setPublishingSubmission(null);
        if (selectedSubmission && selectedSubmission.id === publishingSubmission.id) {
          setSelectedSubmission({
            ...selectedSubmission,
            status: 'Published',
            published_property_id: data.propertyId,
          });
        }
        fetchSubmissions();
        fetchProperties();
      } else {
        showToast(data.error || 'Failed to publish property', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error publishing property', 'error');
    } finally {
      setPublishingLoading(false);
    }
  };

  // Inspect Single Lead Drawer
  const openLeadDrawer = async (lead: Lead) => {
    setSelectedLead(lead);
    try {
      const res = await fetch(`/api/crm/leads/${lead.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedLead(data.lead);
        setLeadActivities(data.activities || []);
      }
    } catch (err) {
      console.error('Error loading lead details:', err);
    }
  };

  // Advance Pipeline Stage
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Lead moved to "${newStatus}"`);
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch {
      showToast('Connection error', 'error');
    }
  };

  // Create Lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm),
      });
      if (res.ok) {
        showToast('New lead created successfully');
        setShowAddLeadModal(false);
        setLeadForm({
          name: '',
          phone: '',
          email: '',
          source: 'Website',
          status: 'New',
          priority: 'Medium',
          property_title: '',
          budget: '',
          preferred_location: '',
          property_type: 'Apartment',
          notes: '',
        });
        fetchLeads();
        fetchMetrics();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to create lead', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Toggle Followup Completion
  const toggleFollowupStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await fetch('/api/crm/followups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Task marked as ${nextStatus}`);
        setFollowups((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: nextStatus } : f))
        );
        fetchMetrics();
      }
    } catch {
      showToast('Failed to update task', 'error');
    }
  };

  // Create Followup
  const handleCreateFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...followupForm,
          lead_id: Number(followupForm.lead_id),
          due_date: followupForm.scheduled_at,
        }),
      });
      if (res.ok) {
        showToast('Follow-up scheduled successfully');
        setShowAddFollowupModal(false);
        setFollowupForm({
          lead_id: '',
          task_type: 'Call',
          scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
          notes: '',
        });
        fetchFollowups();
        fetchMetrics();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to schedule follow-up', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Create Deal
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dealForm,
          lead_id: Number(dealForm.lead_id),
          property_id: dealForm.property_id ? Number(dealForm.property_id) : null,
          deal_value: Number(dealForm.deal_value),
        }),
      });
      if (res.ok) {
        showToast('Deal created successfully');
        setShowAddDealModal(false);
        setDealForm({
          lead_id: '',
          property_id: '',
          deal_name: '',
          deal_value: '',
          stage: 'Proposal',
          expected_close_date: '',
          assigned_agent: 'Sales Team',
        });
        fetchDeals();
        fetchMetrics();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to create deal', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Save Property
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProperty
        ? `/api/properties/${editingProperty.id}`
        : '/api/properties';
      const method = editingProperty ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyForm),
      });

      if (res.ok) {
        showToast(editingProperty ? 'Property updated!' : 'Property added!');
        setShowPropertyModal(false);
        setEditingProperty(null);
        fetchProperties();
      } else {
        showToast('Failed to save property', 'error');
      }
    } catch {
      showToast('Error saving property', 'error');
    }
  };

  // Save Project with Video support
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });

      if (res.ok) {
        showToast(editingProject ? 'Project updated!' : 'Project added!');
        setShowProjectModal(false);
        setEditingProject(null);
        fetchProjects();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save project', 'error');
      }
    } catch {
      showToast('Error saving project', 'error');
    }
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      let url = '';
      if (deleteModal.type === 'lead') url = `/api/crm/leads/${deleteModal.id}`;
      if (deleteModal.type === 'property') url = `/api/properties/${deleteModal.id}`;
      if (deleteModal.type === 'project') url = `/api/projects/${deleteModal.id}`;

      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        showToast(`${deleteModal.title} deleted successfully`);
        if (deleteModal.type === 'lead') fetchLeads();
        if (deleteModal.type === 'property') fetchProperties();
        if (deleteModal.type === 'project') fetchProjects();
      } else {
        showToast('Failed to delete item', 'error');
      }
    } catch {
      showToast('Error during deletion', 'error');
    } finally {
      setDeleteModal(null);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await fetch('/api/crm/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Password updated securely!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Failed to change password', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        !leadSearch ||
        lead.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.phone?.includes(leadSearch) ||
        lead.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.property_title?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.preferred_location?.toLowerCase().includes(leadSearch.toLowerCase());

      const matchStatus =
        leadStatusFilter === 'All' || lead.status === leadStatusFilter;

      const matchSource =
        leadSourceFilter === 'All' || lead.source === leadSourceFilter;

      const matchPriority =
        leadPriorityFilter === 'All' || lead.priority === leadPriorityFilter;

      return matchSearch && matchStatus && matchSource && matchPriority;
    });
  }, [leads, leadSearch, leadStatusFilter, leadSourceFilter, leadPriorityFilter]);

  // Filtered Follow-ups
  const filteredFollowups = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return followups.filter((f) => {
      if (followupFilter === 'all') return true;
      const fDate = f.scheduled_at ? f.scheduled_at.split('T')[0] : '';
      if (followupFilter === 'today') return fDate === todayStr && f.status !== 'Completed';
      if (followupFilter === 'overdue') return fDate < todayStr && f.status !== 'Completed';
      if (followupFilter === 'upcoming') return fDate > todayStr && f.status !== 'Completed';
      return true;
    });
  }, [followups, followupFilter]);

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  // Nav Items array
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
    {
      id: 'submissions',
      label: 'Property Submissions',
      icon: 'fa-house-circle-check',
      badge: submissionCounters.pendingReview ? `${submissionCounters.pendingReview} new` : (submissionCounters.total > 0 ? submissionCounters.total : undefined),
      badgeColor: submissionCounters.pendingReview ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' : undefined,
    },
    { id: 'leads', label: 'Leads Directory', icon: 'fa-users', badge: leads.length },
    { id: 'pipeline', label: 'Kanban Pipeline', icon: 'fa-table-columns' },
    { id: 'followups', label: 'Follow-ups & Tasks', icon: 'fa-calendar-check', badge: metrics?.overdueFollowUps ? `${metrics.overdueFollowUps} overdue` : undefined, badgeColor: 'bg-rose-500/30 text-rose-300' },
    { id: 'deals', label: 'Deals & Revenue', icon: 'fa-handshake' },
    { id: 'properties', label: 'Properties', icon: 'fa-building', badge: properties.length },
    { id: 'projects', label: 'Flagship Projects', icon: 'fa-city', badge: projects.length },
    { id: 'settings', label: 'Security & Profile', icon: 'fa-shield-halved' },
  ];

  return (
    <div className="min-h-screen bg-[#070e1b] text-white flex selection:bg-[#d4af37]/30 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            }`}
          >
            <i
              className={`fa-solid ${
                toast.type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation text-rose-400'
              }`}
            />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* TASK 1: FIXED LEFT SIDEBAR NAVIGATION */}
      {/* ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#091222] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo & Branding */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f5d77f] to-[#b38b25] flex items-center justify-center shadow-lg shadow-[#d4af37]/25 group-hover:scale-105 transition">
                <span className="font-serif text-[#0b1528] font-black text-xl">A</span>
              </div>
              <div className="text-left">
                <div className="font-serif text-sm font-bold tracking-widest text-white">AVISHKAR REALTY</div>
                <div className="text-[9px] tracking-[0.25em] text-[#d4af37] font-semibold -mt-0.5">ADMIN & CRM</div>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  id={`nav-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all flex items-center justify-between group active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#d4af37]/25 to-[#f5d77f]/10 text-[#f5d77f] border border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                    <i
                      className={`fa-solid ${item.icon} text-sm w-4 text-center transition-colors ${
                        isActive ? 'text-[#d4af37]' : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold pointer-events-none ${
                        item.badgeColor || (isActive ? 'bg-[#d4af37]/30 text-[#f5d77f]' : 'bg-white/10 text-gray-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-[#f5d77f] text-xs font-bold shrink-0">
              {adminUser?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{adminUser?.email || 'admin@gmail.com'}</div>
              <div className="text-[10px] text-[#d4af37] font-semibold uppercase tracking-wider truncate">
                {adminUser?.role || 'Super Admin'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MySQL Online
            </span>
            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
            >
              <i className="fa-solid fa-power-off text-xs" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 bg-[#091222] border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white"
            >
              <i className="fa-solid fa-bars" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider hidden sm:inline">
                Avishkar Realty Management &bull;{' '}
              </span>
              <span className="text-sm font-serif font-bold text-white capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                const exportType = activeTab === 'submissions' ? 'submissions' : 'leads';
                window.open(`/api/crm/export?type=${exportType}`, '_blank');
              }}
              title={activeTab === 'submissions' ? 'Export property submissions to CSV' : 'Export all leads to CSV'}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-file-arrow-down text-[#d4af37]" />
              <span className="hidden sm:inline">Export {activeTab === 'submissions' ? 'Submissions' : 'CSV'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
              <span className="hidden sm:inline">Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-right-from-bracket text-xs" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-4 sm:p-8 pt-6 max-w-7xl w-full mx-auto">
          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                    Executive Dashboard
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Real-time CRM metrics, verified lead attribution, and Ahmedabad portfolio performance
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                    <span>New Lead</span>
                  </button>
                  <button
                    onClick={() => setShowAddFollowupModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-xs transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-calendar-plus text-[#d4af37]" />
                    <span>Schedule Task</span>
                  </button>
                </div>
              </div>

              {/* Top KPI Cards (Interactive & Clickable - High Contrast Dark Luxury) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab('leads')}
                  className="glass-card bg-[#0c1628]/95 rounded-2xl p-5 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-[#d4af37]/60 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  title="Click to view Leads Directory"
                >
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Total Leads</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-[#d4af37] group-hover:text-[#0b1528] transition-colors">
                      <i className="fa-solid fa-users text-xs" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {loadingMetrics && !metrics ? (leads.length || '...') : (metrics?.totalLeads ?? leads.length)}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium">
                      <i className="fa-solid fa-arrow-trend-up text-[10px]" />
                      <span>+{metrics?.newLeadsThisMonth || 0} this month</span>
                    </span>
                    <span className="text-[#f5d77f] font-semibold text-[10px]">View &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setLeadStatusFilter('New');
                    setActiveTab('leads');
                  }}
                  className="glass-card bg-[#0c1628]/95 rounded-2xl p-5 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-amber-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  title="Click to view today's new inquiries"
                >
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Today's Inquiries</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-[#0b1528] transition-colors">
                      <i className="fa-solid fa-bolt text-xs" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#f5d77f]">
                    {loadingMetrics && !metrics ? '...' : (metrics?.newLeadsToday || 0)}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
                    <span>Immediate follow-up</span>
                    <span className="text-[#f5d77f] font-semibold text-[10px]">View &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('pipeline')}
                  className="glass-card bg-[#0c1628]/95 rounded-2xl p-5 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-[#d4af37]/60 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  title="Click to open Kanban Pipeline"
                >
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Pipeline Value</span>
                    <div className="w-8 h-8 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#0b1528] transition-colors">
                      <i className="fa-solid fa-indian-rupee-sign text-xs" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    ₹{(metrics?.pipelineValue || 0) > 0 ? (metrics!.pipelineValue / 10000000).toFixed(2) + ' Cr' : '0.00'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between">
                    <span>Active qualified deals</span>
                    <span className="text-[#d4af37] font-semibold text-[10px]">Pipeline &rarr;</span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('followups')}
                  className="glass-card bg-[#0c1628]/95 rounded-2xl p-5 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-emerald-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  title="Click to manage Follow-up Tasks"
                >
                  <div className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Follow-ups</span>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      (metrics?.overdueFollowUps || 0) > 0
                        ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400 animate-pulse'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}>
                      <i className="fa-solid fa-clock text-xs" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {metrics?.todayFollowUps || 0} Due
                  </div>
                  <div className={`text-[11px] mt-2 flex items-center justify-between ${
                    (metrics?.overdueFollowUps || 0) > 0 ? 'text-rose-400 font-bold' : 'text-gray-400'
                  }`}>
                    <span>{(metrics?.overdueFollowUps || 0)} overdue tasks</span>
                    <span className="text-emerald-400 font-semibold text-[10px]">Tasks &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Lead Sources & Pipeline breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Sources */}
                <div className="glass-card bg-[#0c1628]/95 rounded-2xl p-6 border border-white/10 shadow-xl">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-bullhorn text-[#d4af37]" />
                    <span>Leads by Acquisition Channel</span>
                  </h3>
                  {metrics?.sourceBreakdown && metrics.sourceBreakdown.length > 0 ? (
                    <div className="space-y-3">
                      {metrics.sourceBreakdown.map((src) => {
                        const total = metrics.totalLeads || 1;
                        const pct = Math.round((src.count / total) * 100);
                        return (
                          <div key={src.source}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-gray-200 font-medium">{src.source || 'Direct Website'}</span>
                              <span className="text-gray-400 font-semibold">{src.count} leads ({pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#d4af37] to-[#f5d77f] rounded-full shadow-sm shadow-[#d4af37]/30"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-xs">No lead data recorded yet.</div>
                  )}
                </div>

                {/* Status Breakdown */}
                <div className="glass-card bg-[#0c1628]/95 rounded-2xl p-6 border border-white/10 shadow-xl">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-filter text-[#d4af37]" />
                    <span>Pipeline Distribution</span>
                  </h3>
                  {metrics?.statusBreakdown && metrics.statusBreakdown.length > 0 ? (
                    <div className="space-y-2.5">
                      {metrics.statusBreakdown.map((st) => (
                        <div
                          key={st.status}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:border-white/10 transition"
                        >
                          <span className="text-xs font-semibold text-gray-200">{st.status}</span>
                          <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/30 text-xs font-bold">
                            {st.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-xs">No active pipeline records.</div>
                  )}
                </div>

                {/* Recent Activity Audit Trail */}
                <div className="glass-card bg-[#0c1628]/95 rounded-2xl p-6 border border-white/10 shadow-xl">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-[#d4af37]" />
                    <span>Live Activity Stream</span>
                  </h3>
                  {metrics?.recentActivities && metrics.recentActivities.length > 0 ? (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                      {metrics.recentActivities.map((act) => (
                        <div key={act.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 border-l-2 border-l-[#d4af37]">
                          <div className="text-xs text-gray-200 font-medium leading-relaxed">{act.description}</div>
                          <div className="text-[10px] text-[#f5d77f]/80 font-semibold mt-1 flex items-center gap-1.5">
                            <i className="fa-regular fa-clock text-[9px]" />
                            <span>
                              {new Date(act.created_at).toLocaleString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-xs">No activity logged yet.</div>
                  )}
                </div>
              </div>

              {/* Quick Portfolio Status */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-amber-950/20 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl text-[#d4af37]">
                    <i className="fa-solid fa-gem" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Ahmedabad Property Portfolio</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {metrics?.totalProjects || 0} Flagship Real Estate Projects &bull; {metrics?.totalProperties || 0} Verified Resale / Rental Properties
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition"
                  >
                    Manage Properties
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-4 py-2 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37]/30 border border-[#d4af37]/40 text-xs font-semibold text-[#f5d77f] transition"
                  >
                    Manage Projects
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: PROPERTY SUBMISSIONS & APPROVAL WORKFLOW (MODULE 3) */}
          {/* ========================================================================= */}
          {activeTab === 'submissions' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight flex items-center gap-3">
                    <span>Property Submissions</span>
                    {submissionCounters.pendingReview > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold font-sans">
                        {submissionCounters.pendingReview} Pending
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Review, verify, and approve owner-submitted resale and rental listings across Ahmedabad
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={fetchSubmissions}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center gap-1.5"
                    title="Refresh Submissions"
                  >
                    <i className={`fa-solid fa-arrows-rotate text-xs ${loadingSubmissions ? 'fa-spin text-[#d4af37]' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <Link
                    href="/list-your-property"
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-plus text-xs" />
                    <span>Open Public Form</span>
                  </Link>
                </div>
              </div>

              {/* 3.1 Submissions KPI Counters (Interactive Filter Pills) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'All', label: 'Total', count: submissionCounters.total, color: 'text-white', border: 'hover:border-white/40' },
                  { id: 'Pending Review', label: 'Pending Review', count: submissionCounters.pendingReview, color: 'text-amber-400', border: 'hover:border-amber-500/50' },
                  { id: 'Under Review', label: 'Under Review', count: submissionCounters.underReview, color: 'text-blue-400', border: 'hover:border-blue-500/50' },
                  { id: 'Approved', label: 'Approved', count: submissionCounters.approved, color: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
                  { id: 'Published', label: 'Published', count: submissionCounters.published, color: 'text-purple-400', border: 'hover:border-purple-500/50' },
                  { id: 'Rejected', label: 'Rejected', count: submissionCounters.rejected, color: 'text-rose-400', border: 'hover:border-rose-500/50' },
                ].map((stat) => {
                  const isActive = submissionStatusFilter === stat.id;
                  return (
                    <div
                      key={stat.id}
                      onClick={() => setSubmissionStatusFilter(stat.id)}
                      className={`glass-card bg-[#0c1628]/95 rounded-2xl p-4 border cursor-pointer transition-all ${
                        isActive
                          ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/10'
                          : `border-white/10 ${stat.border}`
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider truncate mb-1">
                        {stat.label}
                      </div>
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {loadingSubmissions && !submissions.length ? '...' : stat.count}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3.2 Search & Filters Bar */}
              <div className="glass-card bg-[#0c1628]/95 rounded-2xl p-4 border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-xl">
                {/* Search */}
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search ref, owner, phone, locality..."
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={submissionStatusFilter}
                    onChange={(e) => setSubmissionStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0c1628] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Review Statuses</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published to Live Site</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                {/* Purpose Filter */}
                <div>
                  <select
                    value={submissionPurposeFilter}
                    onChange={(e) => setSubmissionPurposeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0c1628] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Purposes (Sell & Rent)</option>
                    <option value="Sell">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <select
                    value={submissionTypeFilter}
                    onChange={(e) => setSubmissionTypeFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0c1628] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Property Types</option>
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">House / Villa</option>
                    <option value="Plot">Residential Plot</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Shop / Showroom">Shop / Showroom</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {Boolean(submissionSearch || submissionStatusFilter !== 'All' || submissionPurposeFilter !== 'All' || submissionTypeFilter !== 'All') && (
                  <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <span className="text-gray-400">
                      Active filters applied &bull; Showing <strong className="text-white">{submissions.length}</strong> record{submissions.length === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmissionSearch('');
                        setSubmissionStatusFilter('All');
                        setSubmissionPurposeFilter('All');
                        setSubmissionTypeFilter('All');
                      }}
                      className="text-[#d4af37] hover:text-[#f5d77f] hover:underline flex items-center gap-1.5 font-semibold transition"
                    >
                      <i className="fa-solid fa-rotate-left text-[10px]" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3.2 Submissions Directory Table */}
              <div className="glass-card bg-[#0c1628]/95 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Ref ID</th>
                        <th className="py-3.5 px-4">Owner Contact</th>
                        <th className="py-3.5 px-4">Purpose</th>
                        <th className="py-3.5 px-4">Property & Type</th>
                        <th className="py-3.5 px-4">Locality</th>
                        <th className="py-3.5 px-4">Expected Price</th>
                        <th className="py-3.5 px-4">Photos</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingSubmissions ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-gray-400">
                            <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#d4af37] mb-2" />
                            <div>Loading property submissions...</div>
                          </td>
                        </tr>
                      ) : submissions.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-gray-500">
                            <i className="fa-solid fa-inbox text-3xl mb-2 text-gray-600" />
                            <div className="text-sm font-semibold text-gray-400">No submissions found</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Owner property submissions submitted through /list-your-property will appear here for review.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        submissions.map((sub) => {
                          const statusColors: Record<string, string> = {
                            'Pending Review': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                            'Under Review': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                            'Approved': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                            'Published': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                            'Rejected': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                            'Archived': 'bg-gray-500/20 text-gray-400 border-gray-500/40',
                          };

                          return (
                            <tr key={sub.id} className="hover:bg-white/[0.03] transition group">
                              {/* Ref ID */}
                              <td className="py-3.5 px-4 font-mono font-bold text-[#f5d77f]">
                                {sub.reference_number}
                              </td>

                              {/* Owner */}
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">{sub.owner_name}</div>
                                <div className="text-gray-400 flex items-center gap-1.5 mt-0.5">
                                  <span>{sub.owner_phone}</span>
                                  <a
                                    href={`https://wa.me/91${sub.owner_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(sub.owner_name)},%20regarding%20your%20property%20submission%20${sub.reference_number}%20with%20Avishkar%20Realty...`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 ml-1"
                                    title="WhatsApp Owner"
                                  >
                                    <i className="fa-brands fa-whatsapp text-xs" />
                                  </a>
                                </div>
                              </td>

                              {/* Purpose */}
                              <td className="py-3.5 px-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    sub.listing_purpose === 'Rent'
                                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                                      : 'bg-[#d4af37]/15 text-[#f5d77f] border border-[#d4af37]/30'
                                  }`}
                                >
                                  {sub.listing_purpose}
                                </span>
                              </td>

                              {/* Property Title */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <div className="font-medium text-gray-200 truncate">{sub.property_title}</div>
                                <div className="text-[11px] text-gray-400">
                                  {sub.property_type} {sub.bedrooms > 0 ? `• ${sub.bedrooms} BHK` : ''} {sub.area > 0 ? `• ${sub.area} ${sub.area_unit}` : ''}
                                </div>
                              </td>

                              {/* Locality */}
                              <td className="py-3.5 px-4 text-gray-300">
                                <div>{sub.locality}</div>
                                <div className="text-[10px] text-gray-500">{sub.city}</div>
                              </td>

                              {/* Expected Price */}
                              <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                                ₹
                                {sub.expected_price >= 10000000
                                  ? `${(sub.expected_price / 10000000).toFixed(2)} Cr`
                                  : sub.expected_price >= 100000
                                  ? `${(sub.expected_price / 100000).toFixed(2)} L`
                                  : Number(sub.expected_price).toLocaleString('en-IN')}
                                {sub.listing_purpose === 'Rent' && (
                                  <span className="text-[10px] text-gray-400 font-normal"> /mo</span>
                                )}
                              </td>

                              {/* Photos count */}
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px] flex items-center gap-1 w-fit">
                                  <i className="fa-regular fa-image text-[10px]" />
                                  <span>{sub.images?.length || 0}</span>
                                </span>
                              </td>

                              {/* Date */}
                              <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap text-[11px]">
                                {new Date(sub.created_at).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </td>

                              {/* Status Badge */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                    statusColors[sub.status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                  }`}
                                >
                                  {sub.status}
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => openSubmissionDrawer(sub)}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 hover:text-white transition flex items-center gap-1.5"
                                  >
                                    <i className="fa-solid fa-eye text-xs text-[#d4af37]" />
                                    <span>Review</span>
                                  </button>

                                  {/* Quick Publish Button if Approved */}
                                  {sub.status === 'Approved' && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPublishModal(sub)}
                                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] text-xs font-bold shadow hover:brightness-110 transition flex items-center gap-1"
                                      title="Publish as live public property listing"
                                    >
                                      <i className="fa-solid fa-upload text-[10px]" />
                                      <span>Publish</span>
                                    </button>
                                  )}

                                  {sub.status === 'Published' && sub.published_property_id && (
                                    <Link
                                      href={`/properties/${sub.published_property_id}`}
                                      target="_blank"
                                      className="px-2.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/25 transition flex items-center gap-1"
                                      title="View Live Listing on Public Site"
                                    >
                                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                                      <span>Live</span>
                                    </Link>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LEADS DIRECTORY */}
          {/* ========================================================================= */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Leads Directory</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage, assign, and track client inquiries across all digital and direct touchpoints
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                  >
                    <i className="fa-solid fa-user-plus text-xs" />
                    <span>Add Lead</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="glass-card rounded-2xl p-4 border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="relative lg:col-span-2">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    <i className="fa-solid fa-magnifying-glass" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, phone, email, location..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Stages</option>
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={leadSourceFilter}
                    onChange={(e) => setLeadSourceFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Sources</option>
                    <option value="Website">Website Form</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone Call">Direct Call</option>
                    <option value="Walk-in">Walk-in Office</option>
                    <option value="Referral">Referral</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>

                <div>
                  <select
                    value={leadPriorityFilter}
                    onChange={(e) => setLeadPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-gray-200 text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="All">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Contact</th>
                        <th className="py-3.5 px-4">Interest / Property</th>
                        <th className="py-3.5 px-4">Stage</th>
                        <th className="py-3.5 px-4">Priority</th>
                        <th className="py-3.5 px-4">Source</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loadingLeads ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-500">
                            <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#d4af37] mb-2" />
                            <div>Loading leads from MySQL...</div>
                          </td>
                        </tr>
                      ) : filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-gray-500">
                            <i className="fa-regular fa-folder-open text-2xl text-gray-600 mb-2" />
                            <p>No leads match your current filter parameters.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.03] transition group">
                            {/* Contact */}
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white group-hover:text-[#f5d77f] transition">
                                {lead.name}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="text-gray-400 hover:text-[#d4af37] transition flex items-center gap-1"
                                >
                                  <i className="fa-solid fa-phone text-[10px]" />
                                  <span>{lead.phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 transition"
                                  title="Chat on WhatsApp"
                                >
                                  <i className="fa-brands fa-whatsapp text-xs" />
                                </a>
                              </div>
                              {lead.email && (
                                <div className="text-[11px] text-gray-500 truncate max-w-[180px]">
                                  {lead.email}
                                </div>
                              )}
                            </td>

                            {/* Interest */}
                            <td className="py-3.5 px-4">
                              <div className="text-gray-200 font-medium">
                                {lead.property_title || lead.property_type || 'General Consultation'}
                              </div>
                              <div className="text-gray-400 text-[11px] mt-0.5">
                                {lead.preferred_location ? `📍 ${lead.preferred_location}` : ''}
                                {lead.budget ? ` • Budget: ${lead.budget}` : ''}
                              </div>
                            </td>

                            {/* Stage */}
                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#0c1626] border border-white/10 text-gray-200 focus:outline-none focus:border-[#d4af37]"
                              >
                                {PIPELINE_STAGES.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Priority */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  lead.priority === 'High'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : lead.priority === 'Medium'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}
                              >
                                {lead.priority || 'Medium'}
                              </span>
                            </td>

                            {/* Source */}
                            <td className="py-3.5 px-4 text-gray-400 font-medium">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px]">
                                {lead.source || 'Website'}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                              {new Date(lead.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openLeadDrawer(lead)}
                                  title="Inspect Lead Details"
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition flex items-center justify-center"
                                >
                                  <i className="fa-regular fa-eye text-xs" />
                                </button>
                                <button
                                  onClick={() => {
                                    setFollowupForm({
                                      ...followupForm,
                                      lead_id: String(lead.id),
                                      notes: `Follow-up with ${lead.name}`,
                                    });
                                    setShowAddFollowupModal(true);
                                  }}
                                  title="Schedule Follow-up Task"
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-[#d4af37] transition flex items-center justify-center"
                                >
                                  <i className="fa-solid fa-calendar-plus text-xs" />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteModal({
                                      type: 'lead',
                                      id: lead.id,
                                      title: `Lead "${lead.name}"`,
                                    })
                                  }
                                  title="Delete Lead"
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 transition flex items-center justify-center"
                                >
                                  <i className="fa-regular fa-trash-can text-xs" />
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

          {/* ========================================================================= */}
          {/* TASK 2: KANBAN PIPELINE (FIXED HORIZONTAL SCROLL & NO OVERLAPS) */}
          {/* ========================================================================= */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Visual Sales Pipeline</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Scroll horizontally across all 7 stages. Each lead card stays strictly inside its column without overlap.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddLeadModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  <span>New Lead</span>
                </button>
              </div>

              {/* Kanban Horizontal Scrollable Board */}
              <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start scrollbar-thin">
                {PIPELINE_STAGES.map((stage) => {
                  const stageLeads = leads.filter((l) => l.status === stage.id);
                  return (
                    <div
                      key={stage.id}
                      className="min-w-[280px] w-[280px] shrink-0 glass-card rounded-2xl p-3.5 border border-white/10 flex flex-col bg-[#091322]/80 shadow-xl"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                        <span className="text-xs font-bold text-white tracking-wide">{stage.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stage.color}`}>
                          {stageLeads.length}
                        </span>
                      </div>

                      {/* Cards List */}
                      <div className="space-y-3 max-h-[calc(100vh-290px)] overflow-y-auto pr-1">
                        {stageLeads.length === 0 ? (
                          <div className="py-8 text-center text-gray-500 text-xs border border-dashed border-white/10 rounded-xl">
                            No leads in this stage
                          </div>
                        ) : (
                          stageLeads.map((lead) => (
                            <div
                              key={lead.id}
                              className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition shadow-sm space-y-2.5 overflow-hidden"
                            >
                              {/* Name & Priority */}
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  onClick={() => openLeadDrawer(lead)}
                                  className="font-bold text-white text-xs hover:text-[#f5d77f] cursor-pointer transition break-words"
                                >
                                  {lead.name}
                                </h4>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                                    lead.priority === 'High'
                                      ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                                      : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                  }`}
                                >
                                  {lead.priority}
                                </span>
                              </div>

                              {/* Property & Budget */}
                              <div className="text-[11px] text-gray-400 space-y-0.5 break-words">
                                <div className="text-gray-200 font-medium truncate">
                                  🏢 {lead.property_title || lead.preferred_location || 'General Inquiry'}
                                </div>
                                {lead.budget && <div className="text-[#f5d77f]">💰 {lead.budget}</div>}
                              </div>

                              {/* Contact Row */}
                              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/5">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="text-gray-300 hover:text-white flex items-center gap-1 transition"
                                >
                                  <i className="fa-solid fa-phone text-[10px] text-[#d4af37]" />
                                  <span>{lead.phone}</span>
                                </a>
                                <a
                                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 transition"
                                  title="Chat on WhatsApp"
                                >
                                  <i className="fa-brands fa-whatsapp text-sm" />
                                </a>
                              </div>

                              {/* Stage Selector */}
                              <div className="pt-1">
                                <label className="text-[9px] text-gray-500 uppercase tracking-wider block mb-1">
                                  Advance Stage:
                                </label>
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                  className="w-full text-[11px] bg-[#070e1b] text-gray-200 py-1 px-2 rounded-lg border border-white/10 focus:outline-none focus:border-[#d4af37]"
                                >
                                  {PIPELINE_STAGES.map((s) => (
                                    <option key={s.id} value={s.id}>
                                      {s.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FOLLOW-UPS & TASKS */}
          {/* ========================================================================= */}
          {activeTab === 'followups' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Follow-up Management</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Scheduled calls, client meetings, site inspections, and WhatsApp follow-ups
                  </p>
                </div>

                <button
                  onClick={() => setShowAddFollowupModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-calendar-plus text-xs" />
                  <span>Schedule Task</span>
                </button>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All Tasks', count: followups.length },
                  { id: 'today', label: "Today's Tasks", count: metrics?.todayFollowUps || 0, alert: false },
                  { id: 'overdue', label: 'Overdue', count: metrics?.overdueFollowUps || 0, alert: (metrics?.overdueFollowUps || 0) > 0 },
                  { id: 'upcoming', label: 'Upcoming', count: followups.filter((f) => f.status !== 'Completed').length },
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setFollowupFilter(sub.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 whitespace-nowrap ${
                      followupFilter === sub.id
                        ? 'bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/30'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                  >
                    <span>{sub.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        sub.alert ? 'bg-rose-500/30 text-rose-300' : 'bg-white/10'
                      }`}
                    >
                      {sub.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tasks list */}
              <div className="space-y-3">
                {loadingFollowups ? (
                  <div className="py-12 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#d4af37] mb-2" />
                    <div>Loading follow-ups...</div>
                  </div>
                ) : filteredFollowups.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center text-gray-500 border border-white/10">
                    <i className="fa-solid fa-clipboard-check text-3xl text-emerald-400/60 mb-3" />
                    <h3 className="text-sm font-semibold text-white">All Caught Up!</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      No pending tasks in this category. Schedule new follow-ups to maintain client engagement.
                    </p>
                  </div>
                ) : (
                  filteredFollowups.map((task) => {
                    const isDone = task.status === 'Completed';
                    return (
                      <div
                        key={task.id}
                        className={`glass-card rounded-2xl p-4 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isDone
                            ? 'border-white/5 bg-white/[0.01] opacity-60'
                            : 'border-white/10 hover:border-[#d4af37]/30'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <button
                            onClick={() => toggleFollowupStatus(task.id, task.status)}
                            className={`w-6 h-6 rounded-lg mt-0.5 border flex items-center justify-center transition shrink-0 ${
                              isDone
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : 'bg-white/5 border-white/20 text-transparent hover:text-emerald-400'
                            }`}
                          >
                            <i className="fa-solid fa-check text-xs" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  task.task_type === 'Call'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : task.task_type === 'Site Visit'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : task.task_type === 'Meeting'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {task.task_type}
                              </span>
                              <span className="text-xs font-semibold text-white">
                                {task.lead_name || `Lead #${task.lead_id}`}
                              </span>
                              {task.lead_phone && (
                                <span className="text-xs text-gray-400">({task.lead_phone})</span>
                              )}
                            </div>

                            <p className="text-xs text-gray-300 mt-1">
                              {task.notes || 'Routine follow-up consultation'}
                            </p>

                            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center gap-3">
                              <span className="flex items-center gap-1 text-[#f5d77f]">
                                <i className="fa-regular fa-clock text-[10px]" />
                                {new Date(task.scheduled_at).toLocaleString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {task.property_title && (
                                <span>📍 Property: {task.property_title}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {task.lead_phone && (
                            <>
                              <a
                                href={`tel:${task.lead_phone}`}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition flex items-center gap-1.5"
                              >
                                <i className="fa-solid fa-phone text-xs" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${task.lead_phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition flex items-center gap-1.5"
                              >
                                <i className="fa-brands fa-whatsapp text-xs" />
                                <span>WhatsApp</span>
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: DEALS & REVENUE */}
          {/* ========================================================================= */}
          {activeTab === 'deals' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Deals & Revenue Pipeline</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Track negotiated real estate transactions, tokens, and expected commissions
                  </p>
                </div>

                <button
                  onClick={() => setShowAddDealModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  <span>Create Deal</span>
                </button>
              </div>

              {/* Deals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingDeals ? (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#d4af37] mb-2" />
                    <div>Loading deals...</div>
                  </div>
                ) : deals.length === 0 ? (
                  <div className="col-span-3 glass-card rounded-2xl p-12 text-center text-gray-500 border border-white/10">
                    <i className="fa-solid fa-handshake-slash text-3xl text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Active Deals</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Convert qualified leads into active negotiations by creating a deal.
                    </p>
                  </div>
                ) : (
                  deals.map((deal) => (
                    <div key={deal.id} className="glass-card rounded-2xl p-5 border border-white/10">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-white text-sm">{deal.deal_name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/30">
                          {deal.stage}
                        </span>
                      </div>

                      <div className="text-xl font-bold text-white mb-2">
                        ₹{(Number(deal.deal_value) / 10000000).toFixed(2)} Cr
                      </div>

                      <div className="text-xs text-gray-400 space-y-1 mb-4">
                        {deal.lead_name && <div>👤 Client: <span className="text-gray-200">{deal.lead_name}</span></div>}
                        {deal.property_title && <div>🏢 Property: <span className="text-gray-200">{deal.property_title}</span></div>}
                        {deal.expected_close_date && (
                          <div>📅 Expected: <span className="text-gray-200">{deal.expected_close_date}</span></div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                        <span>Assigned: {deal.assigned_agent || 'Sales Team'}</span>
                        <span className="text-[10px]">
                          {new Date(deal.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: PROPERTIES MANAGEMENT */}
          {/* ========================================================================= */}
          {activeTab === 'properties' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Properties Directory</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage individual resale, luxury villas, and rental inventory across Ahmedabad
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProperty(null);
                    setPropertyForm({
                      title: '',
                      price: 0,
                      location: '',
                      type: 'Apartment',
                      category: 'Residential',
                      status: 'For Sale',
                      bedrooms: 3,
                      bathrooms: 3,
                      area: 1800,
                      featured: false,
                      image: '',
                      description: '',
                      parking: 1,
                      yearBuilt: new Date().getFullYear(),
                    });
                    setShowPropertyModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  <span>Add Property</span>
                </button>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingProperties ? (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#d4af37] mb-2" />
                    <div>Loading properties...</div>
                  </div>
                ) : properties.length === 0 ? (
                  <div className="col-span-3 glass-card rounded-2xl p-12 text-center text-gray-500 border border-white/10">
                    <i className="fa-solid fa-building text-3xl text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Properties Listed</h3>
                    <p className="text-xs text-gray-400 mt-1">Add your first resale or rental property inventory.</p>
                  </div>
                ) : (
                  properties.map((prop) => (
                    <div key={prop.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden group">
                      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                        <img
                          src={prop.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'}
                          alt={prop.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                            {prop.status}
                          </span>
                          {prop.featured && (
                            <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/90 text-[10px] font-bold text-[#0b1528]">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-xs font-semibold text-[#f5d77f] uppercase tracking-wider mb-1">
                          {prop.category} &bull; {prop.type}
                        </div>
                        <h4 className="font-bold text-white text-base truncate mb-1">{prop.title}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                          <i className="fa-solid fa-location-dot text-[#d4af37]" />
                          <span>{prop.location}</span>
                        </p>

                        <div className="text-lg font-bold text-white mb-4">
                          ₹{(Number(prop.price) / 10000000).toFixed(2)} Cr
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center text-xs text-gray-300 mb-4">
                          <div>
                            <div className="font-bold">{prop.bedrooms}</div>
                            <div className="text-[10px] text-gray-500">Beds</div>
                          </div>
                          <div>
                            <div className="font-bold">{prop.bathrooms}</div>
                            <div className="text-[10px] text-gray-500">Baths</div>
                          </div>
                          <div>
                            <div className="font-bold">{prop.area}</div>
                            <div className="text-[10px] text-gray-500">Sq Ft</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setEditingProperty(prop);
                              setPropertyForm(prop);
                              setShowPropertyModal(true);
                            }}
                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition flex items-center justify-center gap-1.5"
                          >
                            <i className="fa-regular fa-pen-to-square text-xs" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                type: 'property',
                                id: prop.id,
                                title: `Property "${prop.title}"`,
                              })
                            }
                            className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition flex items-center justify-center"
                          >
                            <i className="fa-regular fa-trash-can text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TASK 3: FLAGSHIP PROJECTS (WITH VIDEO MANAGEMENT) */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-white">Flagship Projects Portfolio</h1>
                  <p className="text-xs text-gray-400 mt-1">
                    Ahmedabad developments with RERA registration and promotional 9:16 Reels / YouTube Shorts
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      slug: '',
                      location: '',
                      status: 'Under Construction',
                      zone: 'West',
                      bedrooms: '3 & 4 BHK',
                      displayPrice: 'Price on Request',
                      PlotArea: '',
                      rera: '',
                      address: '',
                      image: '',
                      description: '',
                      youtubeUrl: '',
                      instagramUrl: '',
                      videoThumbnail: '',
                      videoTitle: '',
                      hasVideo: false,
                    });
                    setShowProjectModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2"
                >
                  <i className="fa-solid fa-plus text-xs" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingProjects ? (
                  <div className="col-span-3 py-12 text-center text-gray-500">
                    <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#d4af37] mb-2" />
                    <div>Loading projects...</div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="col-span-3 glass-card rounded-2xl p-12 text-center text-gray-500 border border-white/10">
                    <i className="fa-solid fa-city text-3xl text-gray-600 mb-3" />
                    <h3 className="text-sm font-semibold text-white">No Projects Available</h3>
                    <p className="text-xs text-gray-400 mt-1">Create new project showcase listings.</p>
                  </div>
                ) : (
                  projects.map((proj) => (
                    <div key={proj.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden group">
                      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
                        <img
                          src={proj.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#f5d77f] border border-white/10">
                            {proj.status}
                          </span>
                          {proj.rera && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-[9px] font-bold text-white">
                              RERA
                            </span>
                          )}
                          {proj.hasVideo && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-[9px] font-bold text-white flex items-center gap-1">
                              <i className="fa-solid fa-play text-[8px]" />
                              <span>Reel / Short</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="text-xs font-semibold text-[#d4af37] uppercase tracking-wider mb-1">
                          {proj.zone || 'Ahmedabad'} &bull; {proj.bedrooms}
                        </div>
                        <h4 className="font-bold text-white text-base truncate mb-1">{proj.title}</h4>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                          <i className="fa-solid fa-location-dot text-[#d4af37]" />
                          <span>{proj.location}</span>
                        </p>

                        <div className="text-sm font-bold text-[#f5d77f] mb-4">
                          {proj.displayPrice || 'Price on Request'}
                        </div>

                        {/* Video Attached Status */}
                        {proj.hasVideo && (
                          <div className="mb-4 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-gray-300 flex items-center gap-2">
                            <i className="fa-solid fa-circle-play text-rose-400" />
                            <span className="truncate">
                              {proj.videoTitle || (proj.youtubeUrl ? 'YouTube Short linked' : 'Instagram Reel linked')}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <Link
                            href={`/project/${proj.slug || proj.id}`}
                            target="_blank"
                            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition flex items-center justify-center gap-1"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => {
                              setEditingProject(proj);
                              setProjectForm({
                                ...proj,
                                youtubeUrl: proj.youtubeUrl || '',
                                instagramUrl: proj.instagramUrl || '',
                                videoThumbnail: proj.videoThumbnail || '',
                                videoTitle: proj.videoTitle || '',
                                hasVideo: Boolean(proj.hasVideo),
                              });
                              setShowProjectModal(true);
                            }}
                            className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition flex items-center justify-center gap-1.5"
                          >
                            <i className="fa-regular fa-pen-to-square text-xs" />
                            <span>Edit Project & Video</span>
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                type: 'project',
                                id: proj.id,
                                title: `Project "${proj.title}"`,
                              })
                            }
                            className="w-9 h-9 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition flex items-center justify-center"
                          >
                            <i className="fa-regular fa-trash-can text-xs" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: SECURITY & PROFILE SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl animate-fadeIn">
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">Security & Account Settings</h1>
                <p className="text-xs text-gray-400 mt-1">
                  Admin credential management, session auditing, and role permissions
                </p>
              </div>

              {/* Profile info card */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-id-badge text-[#d4af37]" />
                  <span>Admin Profile Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-gray-400">Authenticated Email</div>
                    <div className="font-semibold text-white text-sm mt-0.5">{adminUser?.email || 'admin@gmail.com'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5">
                    <div className="text-gray-400">Role & Access Scope</div>
                    <div className="font-semibold text-[#f5d77f] text-sm mt-0.5 uppercase tracking-wider">
                      {adminUser?.role || 'Super Admin'}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 sm:col-span-2">
                    <div className="text-gray-400">Database Connection</div>
                    <div className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Hostinger Remote MySQL (`u521358425_avishkarinhtml`) &bull; 256-bit Encrypted SSL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Form */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-key text-[#d4af37]" />
                  <span>Change Admin Password</span>
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Minimum 8 characters"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Repeat new password"
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition disabled:opacity-50"
                    >
                      {passwordLoading ? 'Updating Password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD MANUAL LEAD */}
      {/* ========================================================================= */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl bg-[#0c1626]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Add New Lead</h3>
                <p className="text-xs text-gray-400">Capture client details directly into the CRM pipeline</p>
              </div>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Shah"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="+91 98250 12345"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Acquisition Channel
                  </label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Website">Website Form</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone Call">Direct Call</option>
                    <option value="Walk-in">Walk-in Office</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={leadForm.priority}
                    onChange={(e) => setLeadForm({ ...leadForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={leadForm.budget}
                    onChange={(e) => setLeadForm({ ...leadForm, budget: e.target.value })}
                    placeholder="₹1.5 - ₹2 Cr"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={leadForm.preferred_location}
                    onChange={(e) => setLeadForm({ ...leadForm, preferred_location: e.target.value })}
                    placeholder="Gota, SG Highway, Bodakdev..."
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Property Interest
                  </label>
                  <input
                    type="text"
                    value={leadForm.property_title}
                    onChange={(e) => setLeadForm({ ...leadForm, property_title: e.target.value })}
                    placeholder="e.g. Om Eclat Heights"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Notes & Requirements
                </label>
                <textarea
                  rows={3}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="Specific requirements, configuration, or urgency..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER: LEAD DETAILS & AUDIT LOG */}
      {/* ========================================================================= */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg h-full bg-[#0c1626] border-l border-white/15 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#f5d77f] tracking-wider">Lead Record</span>
                  <h3 className="text-xl font-bold text-white font-serif">{selectedLead.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {/* Status & Priority header */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Current Pipeline Stage</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#070e1b] border border-white/15 text-white focus:outline-none"
                  >
                    {PIPELINE_STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Lead Priority</span>
                  <span className="font-bold text-amber-400">{selectedLead.priority || 'Medium'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Acquisition Source</span>
                  <span className="text-gray-200">{selectedLead.source || 'Website'}</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3 mb-6 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">Direct Contact</h4>
                <div className="p-3 rounded-xl bg-white/5 flex items-center justify-between">
                  <span className="text-gray-300">📞 {selectedLead.phone}</span>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-medium"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-medium"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>

                {selectedLead.email && (
                  <div className="p-3 rounded-xl bg-white/5 text-gray-300">
                    ✉️ {selectedLead.email}
                  </div>
                )}
              </div>

              {/* Requirement details */}
              <div className="space-y-3 mb-6 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">Requirements</h4>
                <div className="p-3.5 rounded-xl bg-white/5 space-y-1.5">
                  <div>Property: <span className="font-semibold text-white">{selectedLead.property_title || 'General Consultation'}</span></div>
                  <div>Budget: <span className="font-semibold text-white">{selectedLead.budget || 'Not specified'}</span></div>
                  <div>Location: <span className="font-semibold text-white">{selectedLead.preferred_location || 'Ahmedabad'}</span></div>
                  {selectedLead.notes && (
                    <div className="pt-2 border-t border-white/5 text-gray-400">
                      "{selectedLead.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Stream */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">Activity History</h4>
                {leadActivities.length === 0 ? (
                  <div className="text-gray-500 text-[11px]">No activity history logged.</div>
                ) : (
                  <div className="space-y-2 border-l border-white/10 pl-3">
                    {leadActivities.map((act) => (
                      <div key={act.id} className="text-[11px]">
                        <div className="text-gray-300">{act.description}</div>
                        <div className="text-[10px] text-gray-500">
                          {new Date(act.created_at).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setFollowupForm({
                    ...followupForm,
                    lead_id: String(selectedLead.id),
                    notes: `Follow-up with ${selectedLead.name}`,
                  });
                  setShowAddFollowupModal(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5d77f] text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-calendar-plus" />
                <span>Schedule Task</span>
              </button>

              <button
                onClick={() => {
                  setDealForm({
                    ...dealForm,
                    lead_id: String(selectedLead.id),
                    deal_name: `${selectedLead.name} - ${selectedLead.property_title || 'Property Acquisition'}`,
                  });
                  setShowAddDealModal(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-handshake" />
                <span>Create Deal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD FOLLOW-UP */}
      {/* ========================================================================= */}
      {showAddFollowupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-card rounded-3xl p-6 border border-white/20 shadow-2xl bg-[#0c1626]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Schedule Follow-up</h3>
                <p className="text-xs text-gray-400">Set date and action item for sales executive</p>
              </div>
              <button
                onClick={() => setShowAddFollowupModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Select Lead *
                </label>
                <select
                  required
                  value={followupForm.lead_id}
                  onChange={(e) => setFollowupForm({ ...followupForm, lead_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">Select a lead...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Task Type
                  </label>
                  <select
                    value={followupForm.task_type}
                    onChange={(e) => setFollowupForm({ ...followupForm, task_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={followupForm.scheduled_at}
                    onChange={(e) => setFollowupForm({ ...followupForm, scheduled_at: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Agenda / Notes
                </label>
                <textarea
                  rows={3}
                  value={followupForm.notes}
                  onChange={(e) => setFollowupForm({ ...followupForm, notes: e.target.value })}
                  placeholder="Points to discuss or site visit requirements..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFollowupModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DEAL */}
      {/* ========================================================================= */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-card rounded-3xl p-6 border border-white/20 shadow-2xl bg-[#0c1626]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">Create Sales Deal</h3>
                <p className="text-xs text-gray-400">Record a high-intent negotiation in the pipeline</p>
              </div>
              <button
                onClick={() => setShowAddDealModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Deal Title *
                </label>
                <input
                  type="text"
                  required
                  value={dealForm.deal_name}
                  onChange={(e) => setDealForm({ ...dealForm, deal_name: e.target.value })}
                  placeholder="e.g. Vikram Patel - 3BHK Om Eclat"
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Client / Lead *
                </label>
                <select
                  required
                  value={dealForm.lead_id}
                  onChange={(e) => setDealForm({ ...dealForm, lead_id: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="">Select client...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Deal Value (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={dealForm.deal_value}
                    onChange={(e) => setDealForm({ ...dealForm, deal_value: e.target.value })}
                    placeholder="12500000"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Stage
                  </label>
                  <select
                    value={dealForm.stage}
                    onChange={(e) => setDealForm({ ...dealForm, stage: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Proposal">Proposal</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="Token Paid">Token Paid</option>
                    <option value="Agreement">Agreement</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  value={dealForm.expected_close_date}
                  onChange={(e) => setDealForm({ ...dealForm, expected_close_date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition"
                >
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT PROPERTY */}
      {/* ========================================================================= */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl bg-[#0c1626]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h3>
                <p className="text-xs text-gray-400">Inventory listing for public marketplace</p>
              </div>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={propertyForm.title || ''}
                  onChange={(e) => setPropertyForm({ ...propertyForm, title: e.target.value })}
                  placeholder="e.g. Luxurious 3 BHK Penthouse in Bodakdev"
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={propertyForm.price || 0}
                    onChange={(e) => setPropertyForm({ ...propertyForm, price: Number(e.target.value) })}
                    placeholder="15000000"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Deal Type
                  </label>
                  <select
                    value={propertyForm.status || 'For Sale'}
                    onChange={(e) => setPropertyForm({ ...propertyForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Commercial Lease">Commercial Lease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={propertyForm.category || 'Residential'}
                    onChange={(e) => setPropertyForm({ ...propertyForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot / Land">Plot / Land</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyForm.location || ''}
                    onChange={(e) => setPropertyForm({ ...propertyForm, location: e.target.value })}
                    placeholder="Gota, SG Highway..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyForm.type || 'Apartment'}
                    onChange={(e) => setPropertyForm({ ...propertyForm, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    value={propertyForm.area || 0}
                    onChange={(e) => setPropertyForm({ ...propertyForm, area: Number(e.target.value) })}
                    placeholder="1800"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={propertyForm.bedrooms || 0}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={propertyForm.bathrooms || 0}
                    onChange={(e) => setPropertyForm({ ...propertyForm, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    value={propertyForm.parking || 0}
                    onChange={(e) => setPropertyForm({ ...propertyForm, parking: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  value={propertyForm.image || ''}
                  onChange={(e) => setPropertyForm({ ...propertyForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredProperty"
                  checked={Boolean(propertyForm.featured)}
                  onChange={(e) => setPropertyForm({ ...propertyForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37]"
                />
                <label htmlFor="featuredProperty" className="text-xs text-gray-300">
                  Feature this property on the homepage
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPropertyModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TASK 3: MODAL: ADD / EDIT PROJECT (WITH 9:16 REEL / SHORTS VIDEO MANAGER) */}
      {/* ========================================================================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl bg-[#0c1626]/95">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  {editingProject ? 'Edit Flagship Project' : 'Add Flagship Project'}
                </h3>
                <p className="text-xs text-gray-400">
                  Manage development specifications, RERA badges, and 9:16 promotional Reels/Shorts
                </p>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Om Eclat Heights"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.slug || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                    placeholder="om-eclat-heights"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.location || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="Gota, Ahmedabad"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={projectForm.status || 'Under Construction'}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0c1626] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Under Construction">Under Construction</option>
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="New Launch">New Launch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Bedrooms / Config
                  </label>
                  <input
                    type="text"
                    value={projectForm.bedrooms || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, bedrooms: e.target.value })}
                    placeholder="3 & 4 BHK"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Display Price
                  </label>
                  <input
                    type="text"
                    value={projectForm.displayPrice || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, displayPrice: e.target.value })}
                    placeholder="₹1.80 Cr Onwards"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    RERA Number
                  </label>
                  <input
                    type="text"
                    value={projectForm.rera || ''}
                    onChange={(e) => setProjectForm({ ...projectForm, rera: e.target.value })}
                    placeholder="PR/GJ/AHMEDABAD/..."
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Primary Banner Image URL
                </label>
                <input
                  type="url"
                  value={projectForm.image || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* ============================================================= */}
              {/* VIDEO MANAGEMENT: REEL SIZE / YOUTUBE SHORTS (9:16 RATIO)     */}
              {/* ============================================================= */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-film text-[#d4af37]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Promotional Videos (Vertical 9:16 Reels & Shorts)
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d77f] font-bold border border-[#d4af37]/30">
                    Reel / Shorts Ratio
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      YouTube Shorts / Video URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.youtubeUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/shorts/... or youtu.be/..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[10px] text-gray-500 mt-0.5">Supports YouTube Shorts, youtu.be, or standard watch URLs</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Instagram Reel / Post URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.instagramUrl || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/reel/... or /p/..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                    <p className="text-[10px] text-gray-500 mt-0.5">Paste Instagram Reel or Video Post URL</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Custom Video Poster / Thumbnail URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={projectForm.videoThumbnail || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, videoThumbnail: e.target.value })}
                      placeholder="Leave empty to auto-extract from video"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Video Title / Caption (Optional)
                    </label>
                    <input
                      type="text"
                      value={projectForm.videoTitle || ''}
                      onChange={(e) => setProjectForm({ ...projectForm, videoTitle: e.target.value })}
                      placeholder="e.g. 4 BHK Show Flat Tour | The Regal"
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="hasVideoToggle"
                    checked={Boolean(projectForm.hasVideo || projectForm.youtubeUrl || projectForm.instagramUrl)}
                    onChange={(e) => setProjectForm({ ...projectForm, hasVideo: e.target.checked })}
                    className="w-4 h-4 rounded text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <label htmlFor="hasVideoToggle" className="text-xs text-gray-300">
                    Enable Video Badge & Showcase for this Project
                  </label>
                </div>

                {/* Live 9:16 Vertical Preview inside modal */}
                {(projectForm.youtubeUrl || projectForm.instagramUrl) && (
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                      Live 9:16 Vertical Player Preview (Reel / Shorts size):
                    </span>
                    <div className="flex justify-center">
                      {projectForm.youtubeUrl && parseYouTubeUrl(projectForm.youtubeUrl) ? (
                        <div className="w-44 aspect-[9/16] rounded-2xl overflow-hidden border border-[#d4af37]/40 shadow-2xl bg-black">
                          <iframe
                            src={parseYouTubeUrl(projectForm.youtubeUrl)!.embedUrl}
                            title="YouTube Shorts Preview"
                            className="w-full h-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : projectForm.instagramUrl && parseInstagramUrl(projectForm.instagramUrl) ? (
                        <div className="w-44 aspect-[9/16] rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl bg-black">
                          <iframe
                            src={parseInstagramUrl(projectForm.instagramUrl)!.embedUrl}
                            title="Instagram Reel Preview"
                            className="w-full h-full object-cover"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-300">
                          Paste a valid YouTube Shorts or Instagram Reel link to inspect live vertical preview.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition"
                >
                  Save Project & Videos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm glass-card rounded-3xl p-6 border border-rose-500/30 shadow-2xl bg-[#0c1626]/95 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-xl mb-4 border border-rose-500/30">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>

            <h3 className="text-base font-bold text-white mb-2">Confirm Deletion</h3>
            <p className="text-xs text-gray-400 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">{deleteModal.title}</span>? This action is permanent and logged in the system audit trail.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: PROPERTY SUBMISSION REVIEW DRAWER / MODAL (MODULE 3.3) */}
      {/* ========================================================================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto glass-card bg-[#0c1628]/98 rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 scrollbar-thin">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <i className="fa-solid fa-house-circle-check text-lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-[#f5d77f]">
                      {selectedSubmission.reference_number}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        selectedSubmission.status === 'Pending Review'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : selectedSubmission.status === 'Under Review'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                          : selectedSubmission.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : selectedSubmission.status === 'Published'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted on {new Date(selectedSubmission.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* 2-Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Photos & Property Info */}
              <div className="space-y-5">
                {/* Image Gallery */}
                <div>
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Uploaded Property Photos ({selectedSubmission.images?.length || 0})</span>
                  </div>

                  {selectedSubmission.images && selectedSubmission.images.length > 0 ? (
                    <div className="space-y-2">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/15 bg-black/40 shadow-inner">
                        <img
                          src={selectedSubmission.images[0]}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {selectedSubmission.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {selectedSubmission.images.map((imgUrl: string, idx: number) => (
                            <a
                              key={idx}
                              href={imgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 hover:scale-105 transition"
                            >
                              <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-center text-gray-500 text-xs">
                      No photos uploaded by owner
                    </div>
                  )}
                </div>

                {/* Property Details Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{selectedSubmission.property_title}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d77f] text-xs font-bold font-mono">
                      ₹
                      {selectedSubmission.expected_price >= 10000000
                        ? `${(selectedSubmission.expected_price / 10000000).toFixed(2)} Cr`
                        : selectedSubmission.expected_price >= 100000
                        ? `${(selectedSubmission.expected_price / 100000).toFixed(2)} Lakh`
                        : Number(selectedSubmission.expected_price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Purpose:</span>{' '}
                      <span className="font-semibold text-white">For {selectedSubmission.listing_purpose}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>{' '}
                      <span className="font-semibold text-white">{selectedSubmission.property_type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Locality:</span>{' '}
                      <span className="font-semibold text-white">{selectedSubmission.locality}, {selectedSubmission.city}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Carpet Area:</span>{' '}
                      <span className="font-semibold text-white">{selectedSubmission.area || 'N/A'} {selectedSubmission.area_unit}</span>
                    </div>
                    {selectedSubmission.bedrooms > 0 && (
                      <div>
                        <span className="text-gray-400">Configuration:</span>{' '}
                        <span className="font-semibold text-white">{selectedSubmission.bedrooms} BHK / {selectedSubmission.bathrooms} Bath</span>
                      </div>
                    )}
                    {selectedSubmission.furnishing && (
                      <div>
                        <span className="text-gray-400">Furnishing:</span>{' '}
                        <span className="font-semibold text-white">{selectedSubmission.furnishing}</span>
                      </div>
                    )}
                    {selectedSubmission.parking > 0 && (
                      <div>
                        <span className="text-gray-400">Parking:</span>{' '}
                        <span className="font-semibold text-white">{selectedSubmission.parking} Space(s)</span>
                      </div>
                    )}
                  </div>

                  {selectedSubmission.description && (
                    <div className="pt-2 border-t border-white/5 text-xs">
                      <div className="text-gray-400 font-semibold mb-1">Owner Notes / Description:</div>
                      <div className="text-gray-300 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                        {selectedSubmission.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Owner Info, Admin Notes, & Status Workflow */}
              <div className="space-y-5">
                {/* Owner Private Info (Visible to authorized admin only) */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  <div className="text-xs font-semibold text-[#f5d77f] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-user-shield text-[#d4af37]" />
                      <span>Owner Contact (Confidential)</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      <i className="fa-solid fa-check-circle mr-1" />
                      Consent Verified
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Owner Name:</span>
                      <span className="font-bold text-white">{selectedSubmission.owner_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Mobile Phone:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white font-semibold">{selectedSubmission.owner_phone}</span>
                        <a
                          href={`tel:${selectedSubmission.owner_phone}`}
                          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-blue-400 flex items-center justify-center text-[10px]"
                          title="Call Owner"
                        >
                          <i className="fa-solid fa-phone" />
                        </a>
                        <a
                          href={`https://wa.me/91${selectedSubmission.owner_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedSubmission.owner_name)},%20I%20am%20calling%20from%20Avishkar%20Realty%20regarding%20your%20property%20submission%20${selectedSubmission.reference_number}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-6 h-6 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 flex items-center justify-center text-[10px]"
                          title="WhatsApp Owner"
                        >
                          <i className="fa-brands fa-whatsapp" />
                        </a>
                      </div>
                    </div>
                    {selectedSubmission.owner_email && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Email:</span>
                        <a href={`mailto:${selectedSubmission.owner_email}`} className="text-blue-300 hover:underline">
                          {selectedSubmission.owner_email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Preferred Contact:</span>
                      <span className="text-gray-200">{selectedSubmission.preferred_contact_method}</span>
                    </div>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-clipboard-list text-[#d4af37]" />
                      <span>Internal Review & Verification Notes</span>
                    </span>
                    {selectedSubmission.reviewed_by && (
                      <span className="text-[10px] text-gray-500">
                        Last by {selectedSubmission.reviewed_by}
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Add verification notes, legal title check, pricing feedback, owner conversation summary..."
                    value={submissionNotesDraft}
                    onChange={(e) => setSubmissionNotesDraft(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
                  />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={savingNotes}
                      onClick={() => handleSaveSubmissionNotes(selectedSubmission.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-200 hover:text-white transition flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-floppy-disk text-xs text-[#d4af37]" />
                      <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                    </button>
                  </div>
                </div>

                {/* Status Transition & Approval Workflow Actions */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Workflow Actions
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Mark Under Review */}
                    <button
                      type="button"
                      onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, 'Under Review')}
                      disabled={selectedSubmission.status === 'Under Review'}
                      className="py-2.5 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <i className="fa-solid fa-magnifying-glass text-xs" />
                      <span>Mark Under Review</span>
                    </button>

                    {/* Approve Submission */}
                    <button
                      type="button"
                      onClick={() =>
                        setStatusConfirmModal({
                          action: 'Approved',
                          submission: selectedSubmission,
                          note: 'Property verified and approved for public publication.',
                        })
                      }
                      disabled={selectedSubmission.status === 'Approved' || selectedSubmission.status === 'Published'}
                      className="py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <i className="fa-solid fa-check text-xs" />
                      <span>Approve Submission</span>
                    </button>

                    {/* Reject Submission */}
                    <button
                      type="button"
                      onClick={() =>
                        setStatusConfirmModal({
                          action: 'Rejected',
                          submission: selectedSubmission,
                          note: 'Does not meet listing criteria or duplicate record.',
                        })
                      }
                      disabled={selectedSubmission.status === 'Rejected'}
                      className="py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <i className="fa-solid fa-xmark text-xs" />
                      <span>Reject Submission</span>
                    </button>

                    {/* Archive */}
                    <button
                      type="button"
                      onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, 'Archived')}
                      disabled={selectedSubmission.status === 'Archived'}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <i className="fa-solid fa-box-archive text-xs" />
                      <span>Archive</span>
                    </button>
                  </div>

                  {/* High-Impact Action: Publish Live Property Listing (Module 4) */}
                  <div className="pt-2 border-t border-white/5">
                    {selectedSubmission.status === 'Published' && selectedSubmission.published_property_id ? (
                      <div className="p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-between">
                        <div className="text-xs text-purple-200">
                          <span className="font-bold">Published on Live Website</span> as Property #{selectedSubmission.published_property_id}
                        </div>
                        <Link
                          href={`/properties/${selectedSubmission.published_property_id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1"
                        >
                          <span>View Public Page</span>
                          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenPublishModal(selectedSubmission)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f5d77f] to-[#b38b25] text-[#0b1528] font-bold text-xs shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-upload text-xs" />
                        <span>Publish Property to Live Website</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STATUS ACTION CONFIRMATION (APPROVE / REJECT) */}
      {/* ========================================================================= */}
      {statusConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-card bg-[#0c1628]/98 rounded-3xl p-6 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  statusConfirmModal.action === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                <i className={`fa-solid ${statusConfirmModal.action === 'Approved' ? 'fa-check' : 'fa-xmark'}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm {statusConfirmModal.action}
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  {statusConfirmModal.submission.reference_number}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {statusConfirmModal.action === 'Approved'
                ? 'Are you sure you want to approve this submission? Note: Approving does NOT automatically publish the listing publicly until you explicitly select "Publish".'
                : 'Are you sure you want to reject this submission? It will be marked as Rejected in the internal audit directory.'}
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Optional Internal Note:
              </label>
              <textarea
                rows={2}
                value={statusConfirmModal.note}
                onChange={(e) => setStatusConfirmModal({ ...statusConfirmModal, note: e.target.value })}
                className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setStatusConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateSubmissionStatus(
                    statusConfirmModal.submission.id,
                    statusConfirmModal.action,
                    statusConfirmModal.note
                  )
                }
                className={`px-5 py-2 rounded-xl text-xs font-bold shadow transition ${
                  statusConfirmModal.action === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                }`}
              >
                Confirm {statusConfirmModal.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PUBLISH TO LIVE WEBSITE (MODULE 4) */}
      {/* ========================================================================= */}
      {publishingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-card bg-[#0c1628]/98 rounded-3xl p-6 sm:p-8 border border-[#d4af37]/40 shadow-2xl space-y-6 scrollbar-thin">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                  <i className="fa-solid fa-cloud-arrow-up text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Publish Property to Live Website</h3>
                  <p className="text-xs text-gray-400">
                    Review and finalize details before publishing. Owner contact info will remain private.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPublishingSubmission(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <form onSubmit={handleConfirmPublish} className="space-y-4 text-xs">
              {/* Public Title */}
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Public Listing Title <span className="text-[#d4af37]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={publishForm.title || ''}
                  onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Price / Monthly Rent (₹) <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={publishForm.price || 0}
                    onChange={(e) => setPublishForm({ ...publishForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Location / Area <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={publishForm.location || ''}
                    onChange={(e) => setPublishForm({ ...publishForm, location: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Type, Category, Transaction */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Property Type
                  </label>
                  <input
                    type="text"
                    value={publishForm.type || 'Apartment'}
                    onChange={(e) => setPublishForm({ ...publishForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={publishForm.category || 'Residential'}
                    onChange={(e) => setPublishForm({ ...publishForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plots">Plots</option>
                    <option value="Rental">Rental</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Transaction
                  </label>
                  <select
                    value={publishForm.transaction || 'resale'}
                    onChange={(e) => setPublishForm({ ...publishForm, transaction: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0c1628] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  >
                    <option value="resale">Resale</option>
                    <option value="rent">Rent</option>
                    <option value="new_launch">New Launch</option>
                  </select>
                </div>
              </div>

              {/* Area, Bedrooms, Bathrooms, Parking */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Carpet Area
                  </label>
                  <input
                    type="number"
                    value={publishForm.area || 0}
                    onChange={(e) => setPublishForm({ ...publishForm, area: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={publishForm.bedrooms || 0}
                    onChange={(e) => setPublishForm({ ...publishForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={publishForm.bathrooms || 0}
                    onChange={(e) => setPublishForm({ ...publishForm, bathrooms: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Parking
                  </label>
                  <input
                    type="number"
                    value={publishForm.parking || 0}
                    onChange={(e) => setPublishForm({ ...publishForm, parking: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Image URL */}
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Primary Image URL
                </label>
                <input
                  type="text"
                  value={publishForm.image || ''}
                  onChange={(e) => setPublishForm({ ...publishForm, image: e.target.value })}
                  placeholder="https://... or /uploads/submissions/..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Public Listing Description
                </label>
                <textarea
                  rows={3}
                  value={publishForm.description || ''}
                  onChange={(e) => setPublishForm({ ...publishForm, description: e.target.value })}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setPublishingSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishingLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e4c272] text-[#0b1528] font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
                >
                  <i className={`fa-solid ${publishingLoading ? 'fa-circle-notch fa-spin' : 'fa-upload'}`} />
                  <span>{publishingLoading ? 'Publishing...' : 'Confirm & Publish Live Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
