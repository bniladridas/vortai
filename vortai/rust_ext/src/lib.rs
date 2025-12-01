use pyo3::prelude::*;

#[pyfunction]
fn clean_text(text: &str) -> PyResult<String> {
    // Fast text cleaning: trim, normalize spaces
    let cleaned = text.trim()
        .split_whitespace()
        .collect::<Vec<&str>>()
        .join(" ");
    Ok(cleaned)
}

#[pymodule]
fn gemini_rust_ext(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(clean_text, m)?)?;
    Ok(())
}
