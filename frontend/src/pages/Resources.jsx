import { useEffect, useMemo, useState } from "react";
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from "../api/resources";

const resourceTypes = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];
const resourceStatuses = ["ACTIVE", "OUT_OF_SERVICE"];

const emptyForm = {
  name: "",
  type: "LECTURE_HALL",
  capacity: "",
  location: "",
  description: "",
  imageUrl: "",
  status: "ACTIVE",
  availabilityStart: "",
  availabilityEnd: "",
};

const emptyFilters = {
  type: "",
  status: "",
  location: "",
  minCapacity: "",
};

function cleanParams(values) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}

function formatLabel(value) {
  return value ? value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : "-";
}

function formatDateTime(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getTypeAccent(type) {
  const accents = {
    LECTURE_HALL: "bg-blue-50 text-blue-700 ring-blue-200",
    LAB: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    MEETING_ROOM: "bg-violet-50 text-violet-700 ring-violet-200",
    EQUIPMENT: "bg-amber-50 text-amber-700 ring-amber-200",
  };

  return accents[type] || "bg-slate-50 text-slate-700 ring-slate-200";
}

function toPayload(form) {
  const equipment = form.type === "EQUIPMENT";

  return {
    name: form.name.trim(),
    type: form.type,
    capacity: equipment ? null : Number(form.capacity),
    location: equipment ? null : form.location.trim(),
    description: form.description.trim() || null,
    imageUrl: equipment ? form.imageUrl || null : null,
    status: form.status,
    availabilityStart: form.availabilityStart || null,
    availabilityEnd: form.availabilityEnd || null,
  };
}

function toForm(resource) {
  return {
    name: resource.name || "",
    type: resource.type || "LECTURE_HALL",
    capacity: resource.capacity || "",
    location: resource.location || "",
    description: resource.description || "",
    imageUrl: resource.imageUrl || "",
    status: resource.status || "ACTIVE",
    availabilityStart: resource.availabilityStart ? resource.availabilityStart.slice(0, 16) : "",
    availabilityEnd: resource.availabilityEnd ? resource.availabilityEnd.slice(0, 16) : "",
  };
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  );
}

function Resources() {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEquipment = form.type === "EQUIPMENT";

  useEffect(() => {
    loadResources(filters);
  }, [filters]);

  const visibleResources = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) {
      return resources;
    }

    return resources.filter((resource) =>
      [resource.name, resource.description, resource.location, resource.type, resource.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [resources, search]);

  const stats = useMemo(() => {
    return {
      total: resources.length,
      active: resources.filter((resource) => resource.status === "ACTIVE").length,
      outOfService: resources.filter((resource) => resource.status === "OUT_OF_SERVICE").length,
      equipment: resources.filter((resource) => resource.type === "EQUIPMENT").length,
    };
  }, [resources]);

  async function loadResources(nextFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const data = await getResources(cleanParams(nextFilters));
      setResources(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resources.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleTypeChange(nextType) {
    setForm((current) => ({
      ...current,
      type: nextType,
      capacity: nextType === "EQUIPMENT" ? "" : current.capacity,
      location: nextType === "EQUIPMENT" ? "" : current.location,
      imageUrl: nextType === "EQUIPMENT" ? current.imageUrl : "",
    }));
  }

  function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateForm("imageUrl", reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!isEquipment && (!form.location.trim() || !form.capacity || Number(form.capacity) < 1)) {
      setError("Location and valid capacity are required for rooms, halls, and labs.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateResource(editingId, toPayload(form));
        setSuccess("Resource updated successfully.");
      } else {
        await createResource(toPayload(form));
        setSuccess("Resource created successfully.");
      }

      resetForm();
      await loadResources(filters);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resource.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(resource) {
    setEditingId(resource.id);
    setForm(toForm(resource));
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this resource?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteResource(id);
      setSuccess("Resource deleted successfully.");
      if (editingId === id) {
        resetForm();
      }
      await loadResources(filters);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete resource.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Module A</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-950">Facilities & Assets Catalogue</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Maintain bookable lecture halls, labs, meeting rooms, and shared equipment with availability,
                operating status, and searchable metadata.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <Icon>
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </Icon>
              New Resource
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Resources" value={stats.total} tone="text-slate-950" />
            <StatCard label="Active" value={stats.active} tone="text-emerald-700" />
            <StatCard label="Out of Service" value={stats.outOfService} tone="text-red-700" />
            <StatCard label="Equipment Items" value={stats.equipment} tone="text-amber-700" />
          </div>
        </section>

        {(error || success) && (
          <div
            className={`rounded-lg border p-4 text-sm ${
              error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || success}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  {editingId ? "Edit Resource" : "Add Resource"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {isEquipment ? "Equipment does not need capacity or location." : "Rooms require capacity and location."}
                </p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-sm font-medium text-slate-500 hover:text-slate-900">
                  Clear
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Resource Name">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="e.g. Main Auditorium"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                />
              </Field>

              <Field label="Type">
                <div className="grid grid-cols-2 gap-2">
                  {resourceTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeChange(type)}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                        form.type === type
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {formatLabel(type)}
                    </button>
                  ))}
                </div>
              </Field>

              {!isEquipment && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Capacity">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      min="1"
                      placeholder="80"
                      type="number"
                      value={form.capacity}
                      onChange={(event) => updateForm("capacity", event.target.value)}
                    />
                  </Field>

                  <Field label="Location">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Block A, Floor 2"
                      value={form.location}
                      onChange={(event) => updateForm("location", event.target.value)}
                    />
                  </Field>
                </div>
              )}

              {isEquipment && (
                <Field label="Equipment Photo">
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt="Equipment preview"
                        className="mb-3 h-40 w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mb-3 flex h-40 items-center justify-center rounded-lg bg-white text-sm text-slate-400">
                        No photo selected
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                        Upload Photo
                        <input className="hidden" type="file" accept="image/*" onChange={handleImageUpload} />
                      </label>
                      {form.imageUrl && (
                        <button
                          type="button"
                          onClick={() => updateForm("imageUrl", "")}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </Field>
              )}

              <Field label="Status">
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                >
                  {resourceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Description">
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Useful details, included equipment, notes..."
                  rows="3"
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Available From">
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    type="datetime-local"
                    value={form.availabilityStart}
                    onChange={(event) => updateForm("availabilityStart", event.target.value)}
                  />
                </Field>

                <Field label="Available Until">
                  <input
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    type="datetime-local"
                    value={form.availabilityEnd}
                    onChange={(event) => updateForm("availabilityEnd", event.target.value)}
                  />
                </Field>
              </div>

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add to Catalogue"}
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Catalogue</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Showing {visibleResources.length} of {resources.length} resources.
                  </p>
                </div>

                <div className="flex w-full flex-wrap gap-3 xl:max-w-4xl xl:justify-end">
                  <input
                    className="min-w-0 flex-[1_1_220px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Search catalogue"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <select
                    className="min-w-0 flex-[1_1_150px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={filters.type}
                    onChange={(event) => updateFilter("type", event.target.value)}
                  >
                    <option value="">All types</option>
                    {resourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {formatLabel(type)}
                      </option>
                    ))}
                  </select>
                  <select
                    className="min-w-0 flex-[1_1_150px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    value={filters.status}
                    onChange={(event) => updateFilter("status", event.target.value)}
                  >
                    <option value="">All statuses</option>
                    {resourceStatuses.map((status) => (
                      <option key={status} value={status}>
                        {formatLabel(status)}
                      </option>
                    ))}
                  </select>
                  <input
                    className="min-w-0 flex-[1_1_150px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(event) => updateFilter("location", event.target.value)}
                  />
                  <input
                    className="min-w-0 flex-[1_1_120px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    min="1"
                    placeholder="Min cap."
                    type="number"
                    value={filters.minCapacity}
                    onChange={(event) => updateFilter("minCapacity", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="grid gap-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-28 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : visibleResources.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mb-3 rounded-lg bg-white p-3 text-slate-500 shadow-sm">
                    <Icon>
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </Icon>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No resources found</h3>
                  <p className="mt-1 text-sm text-slate-500">Adjust filters or add a new catalogue item.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {visibleResources.map((resource) => (
                    <article
                      key={resource.id}
                      className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        {resource.type === "EQUIPMENT" && (
                          <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            {resource.imageUrl ? (
                              <img src={resource.imageUrl} alt={resource.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
                                No photo
                              </div>
                            )}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-bold text-slate-950">{resource.name}</h3>
                            <span className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${getTypeAccent(resource.type)}`}>
                              {formatLabel(resource.type)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-bold ring-1 ${
                                resource.status === "ACTIVE"
                                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                  : "bg-red-50 text-red-700 ring-red-200"
                              }`}
                            >
                              {formatLabel(resource.status)}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                            {resource.description || "No description provided."}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            type="button"
                            onClick={() => handleEdit(resource)}
                          >
                            <Icon>
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </Icon>
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                            type="button"
                            onClick={() => handleDelete(resource.id)}
                          >
                            <Icon>
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                            </Icon>
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Meta label="Capacity" value={resource.type === "EQUIPMENT" ? "Not applicable" : resource.capacity || "-"} />
                        <Meta label="Location" value={resource.type === "EQUIPMENT" ? "Not applicable" : resource.location || "-"} />
                        <Meta label="Available From" value={formatDateTime(resource.availabilityStart)} />
                        <Meta label="Available Until" value={formatDateTime(resource.availabilityEnd)} />
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default Resources;
