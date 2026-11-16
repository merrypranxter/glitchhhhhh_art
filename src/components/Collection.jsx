import React, { useState } from "react";
import {
  Bookmark,
  ArrowUpRight,
  Search,
  Trash2,
  Download,
  ArrowDownWideNarrow,
} from "lucide-react";
import { engines, recipeDocument, paletteName } from "../data";
import { download } from "../export";
export default function Collection({ saved, onLoad, onDelete, onStudio }) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState("Newest first");
  const filtered = saved
    .filter((s) =>
      `${s.title} ${engines[s.state.engine]} ${paletteName(s.state)}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Newest first"
        ? b.id - a.id
        : sort === "Oldest first"
          ? a.id - b.id
          : a.title.localeCompare(b.title),
    );
  return (
    <div className="collection">
      <div className="collection-heading">
        <div>
          <span className="collection-kicker">YOUR PERSONAL GLITCH VAULT</span>
          <h1>Your happy accidents.</h1>
          <p>Stored in this browser. Export recipes to keep them anywhere.</p>
        </div>
        <span className="work-count">
          {saved.length}
          <small>WORKS & COUNTING</small>
        </span>
      </div>
      {saved.length > 0 && (
        <div className="collection-tools">
          <label>
            <Search size={15} />
            <input
              type="search"
              aria-label="Search saved works"
              placeholder="Find a title, engine, or palette…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label>
            <ArrowDownWideNarrow size={15} />
            <select
              aria-label="Sort saved works"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {["Newest first", "Oldest first", "Title A–Z"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
      )}
      {!saved.length ? (
        <div className="empty">
          <Bookmark size={36} />
          <h2>A little empty. A lot of potential.</h2>
          <p>Save a creation with the bookmark button in the studio.</p>
          <button className="button primary" onClick={onStudio}>
            Back to the playground
            <ArrowUpRight size={16} />
          </button>
        </div>
      ) : !filtered.length ? (
        <div className="empty">
          <Search size={30} />
          <h2>No happy accidents by that name.</h2>
          <button className="button secondary" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      ) : (
        <div className="saved-grid">
          {filtered.map((s) => (
            <article key={s.id}>
              <button className="saved-image" onClick={() => onLoad(s)}>
                <img src={s.thumb} alt={s.title} />
                <span>
                  Open in studio <ArrowUpRight size={16} />
                </span>
              </button>
              <div className="saved-meta">
                <div>
                  <strong>{s.title || "Untitled exploration"}</strong>
                  <small>
                    {engines[s.state.engine]} · {s.state.ratio}
                  </small>
                  <span>SEED {s.state.seed}</span>
                </div>
                <div className="saved-actions">
                  <button
                    title={`Export recipe for ${s.title}`}
                    onClick={() =>
                      download(
                        new Blob(
                          [
                            JSON.stringify(
                              recipeDocument(s.state, s.title, s.timeline),
                              null,
                              2,
                            ),
                          ],
                          { type: "application/json" },
                        ),
                        `glitch-${s.state.seed}.json`,
                      )
                    }
                  >
                    <Download size={14} />
                  </button>
                  <button
                    title={`Delete ${s.title}`}
                    onClick={() => onDelete(s.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
