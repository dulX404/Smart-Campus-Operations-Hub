import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from "../api/resources";

const resourceTypes = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];
const resourceStatuses = ["ACTIVE", "OUT_OF_SERVICE"];

const emptyCreateForm = {
  name: "",
  type: "LECTURE_HALL",
  capacity: "",
  location: "",
  description: "",
  availabilityStart: "",
  availabilityEnd: "",
};

const emptyFilters = {
  type: "",
  status: "",
  location: "",
  minCapacity: "",
};

function formatLabel(value) {
  if (!value) {
    return "Not set";
  }

  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
}

function validateResourceForm(values) {
  if (!values.name.trim()) {
    return "Name is required.";
  }

  if (!values.location.trim()) {
    return "Location is required.";
  }

  if (!values.type) {
    return "Type is required.";
  }

  if (!values.capacity || Number(values.capacity) < 1) {
    return "Capacity must be at least 1.";
  }

  return "";
}

function toPayload(values, { includeStatus = false } = {}) {
  const payload = {
    name: values.name.trim(),
    type: values.type,
    capacity: Number(values.capacity),
    location: values.location.trim(),
    description: values.description.trim() || null,
    availabilityStart: values.availabilityStart || null,
    availabilityEnd: values.availabilityEnd || null,
  };

  if (includeStatus) {
    payload.status = values.status;
  }

  return payload;
}

function toEditForm(resource) {
  return {
    name: resource.name ?? "",
    type: resource.type ?? "LECTURE_HALL",
    capacity: resource.capacity ?? "",
    location: resource.location ?? "",
    description: resource.description ?? "",
    status: resource.status ?? "ACTIVE",
    availabilityStart: resource.availabilityStart ? resource.availabilityStart.slice(0, 16) : "",
    availabilityEnd: resource.availabilityEnd ? resource.availabilityEnd.slice(0, 16) : "",
  };
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadResources(nextFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const data = await getResources(nextFilters);
      setResources(data);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Failed to load resources."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResources();
  }, []);

  async function handleCreateSubmit(event) {
    event.preventDefault();
    const validationError = validateResourceForm(createForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createResource(toPayload(createForm));
      setCreateForm(emptyCreateForm);
      await loadResources();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to create resource."));
    } finally {
      setSaving(false);
    }
  }

  async function handleFilterSubmit(event) {
    event.preventDefault();
    await loadResources(filters);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this resource?");
    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteResource(id);
      if (editingId === id) {
        setEditingId(null);
        setEditForm(null);
      }
      await loadResources();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Failed to delete resource."));
    }
  }

  function startEdit(resource) {
    setEditingId(resource.id);
    setEditForm(toEditForm(resource));
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function handleUpdate(id) {
    const validationError = validateResourceForm(editForm);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateResource(id, toPayload(editForm, { includeStatus: true }));
      cancelEdit();
      await loadResources();
    } catch (updateError) {
      setError(getErrorMessage(updateError, "Failed to update resource."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <PageHeader
        title="Resources"
        description="Manage halls, labs, rooms, and equipment from one place."
      />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-6">
          <form
            onSubmit={handleCreateSubmit}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="text-lg font-semibold text-slate-900">Create Resource</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Name</span>
                <input
                  required
                  value={createForm.name}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Type</span>
                <select
                  value={createForm.type}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, type: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Capacity</span>
                <input
                  required
                  min="1"
                  type="number"
                  value={createForm.capacity}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, capacity: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Location</span>
                <input
                  required
                  value={createForm.location}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, location: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Description</span>
                <textarea
                  rows="3"
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Availability Start
                </span>
                <input
                  type="datetime-local"
                  value={createForm.availabilityStart}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      availabilityStart: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Availability End
                </span>
                <input
                  type="datetime-local"
                  value={createForm.availabilityEnd}
                  onChange={(event) =>
                    setCreateForm((current) => ({
                      ...current,
                      availabilityEnd: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add Resource"}
            </button>
          </form>

          <form
            onSubmit={handleFilterSubmit}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => {
                  setFilters(emptyFilters);
                  loadResources(emptyFilters);
                }}
                className="text-sm font-medium text-slate-600 underline"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Type</span>
                <select
                  value={filters.type}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, type: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="">All Types</option>
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Status</span>
                <select
                  value={filters.status}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, status: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="">All Statuses</option>
                  {resourceStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Location</span>
                <input
                  value={filters.location}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, location: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Minimum Capacity</span>
                <input
                  min="1"
                  type="number"
                  value={filters.minCapacity}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, minCapacity: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-900"
            >
              Apply Filters
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Resource List</h2>
            <button
              type="button"
              onClick={() => loadResources()}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Refresh
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-600">
              Loading resources...
            </div>
          ) : null}

          {!loading && resources.length === 0 ? (
            <div className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-sm text-slate-600">
              No resources found.
            </div>
          ) : null}

          {!loading && resources.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Capacity</th>
                    <th className="px-3 py-3 font-medium">Location</th>
                    <th className="px-3 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {resources.map((resource) => {
                    const isEditing = editingId === resource.id;

                    return (
                      <tr key={resource.id} className="align-top">
                        <td className="px-3 py-4">
                          {isEditing ? (
                            <input
                              value={editForm.name}
                              onChange={(event) =>
                                setEditForm((current) => ({ ...current, name: event.target.value }))
                              }
                              className="w-40 rounded-lg border border-slate-300 px-3 py-2"
                            />
                          ) : (
                            <div>
                              <div className="font-medium text-slate-900">{resource.name}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                {resource.description || "No description"}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          {isEditing ? (
                            <select
                              value={editForm.type}
                              onChange={(event) =>
                                setEditForm((current) => ({ ...current, type: event.target.value }))
                              }
                              className="w-40 rounded-lg border border-slate-300 px-3 py-2"
                            >
                              {resourceTypes.map((type) => (
                                <option key={type} value={type}>
                                  {formatLabel(type)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            formatLabel(resource.type)
                          )}
                        </td>
                        <td className="px-3 py-4">
                          {isEditing ? (
                            <select
                              value={editForm.status}
                              onChange={(event) =>
                                setEditForm((current) => ({ ...current, status: event.target.value }))
                              }
                              className="w-40 rounded-lg border border-slate-300 px-3 py-2"
                            >
                              {resourceStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {formatLabel(status)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            formatLabel(resource.status)
                          )}
                        </td>
                        <td className="px-3 py-4">
                          {isEditing ? (
                            <input
                              min="1"
                              type="number"
                              value={editForm.capacity}
                              onChange={(event) =>
                                setEditForm((current) => ({
                                  ...current,
                                  capacity: event.target.value,
                                }))
                              }
                              className="w-24 rounded-lg border border-slate-300 px-3 py-2"
                            />
                          ) : (
                            resource.capacity
                          )}
                        </td>
                        <td className="px-3 py-4">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                value={editForm.location}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    location: event.target.value,
                                  }))
                                }
                                className="w-44 rounded-lg border border-slate-300 px-3 py-2"
                              />
                              <textarea
                                rows="2"
                                value={editForm.description}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    description: event.target.value,
                                  }))
                                }
                                className="w-44 rounded-lg border border-slate-300 px-3 py-2"
                              />
                              <input
                                type="datetime-local"
                                value={editForm.availabilityStart}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    availabilityStart: event.target.value,
                                  }))
                                }
                                className="w-44 rounded-lg border border-slate-300 px-3 py-2"
                              />
                              <input
                                type="datetime-local"
                                value={editForm.availabilityEnd}
                                onChange={(event) =>
                                  setEditForm((current) => ({
                                    ...current,
                                    availabilityEnd: event.target.value,
                                  }))
                                }
                                className="w-44 rounded-lg border border-slate-300 px-3 py-2"
                              />
                            </div>
                          ) : (
                            <div>
                              <div>{resource.location}</div>
                              <div className="mt-1 text-xs text-slate-500">
                                Start: {resource.availabilityStart || "Not set"}
                              </div>
                              <div className="text-xs text-slate-500">
                                End: {resource.availabilityEnd || "Not set"}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex flex-col gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() => handleUpdate(resource.id)}
                                  className="rounded-lg bg-slate-900 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="rounded-lg border border-slate-300 px-3 py-2"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(resource)}
                                  className="rounded-lg border border-slate-300 px-3 py-2"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(resource.id)}
                                  className="rounded-lg bg-red-600 px-3 py-2 text-white"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default ResourcesPage;
