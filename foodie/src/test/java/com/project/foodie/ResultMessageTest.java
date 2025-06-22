package com.project.foodie;

import com.project.foodie.administration.ResultMessage;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ResultMessageTest {
    @Test
    public void testTwoArgConstructor_SetsMessageAndSuccessOnly() {
        ResultMessage result = new ResultMessage("Operation completed", true);

        assertEquals("Operation completed", result.getMessage());
        assertTrue(result.getSuccess());
        assertNull(result.getData());
    }

    @Test
    public void testThreeArgConstructor_SetsAllFields() {
        Object data = 123;
        ResultMessage result = new ResultMessage("Saved", true, data);

        assertEquals("Saved", result.getMessage());
        assertTrue(result.getSuccess());
        assertEquals(123, result.getData());
    }

    @Test
    public void testSetters_OverrideValuesCorrectly() {
        ResultMessage result = new ResultMessage("Initial", false);
        result.setMessage("Updated");
        result.setSuccess(true);
        result.setData("new-data");

        assertEquals("Updated", result.getMessage());
        assertTrue(result.getSuccess());
        assertEquals("new-data", result.getData());
    }

    @Test
    public void testSetNullValues() {
        ResultMessage result = new ResultMessage("Non-null", true, new Object());
        result.setMessage(null);
        result.setSuccess(null);
        result.setData(null);

        assertNull(result.getMessage());
        assertNull(result.getSuccess());
        assertNull(result.getData());
    }
}
